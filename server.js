const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");
const { execFile } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");
const ffmpegPath = require("ffmpeg-static");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: "4mb" }));

const OPENAI_KEY    = process.env.OPENAI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL  = "https://dxlvsnlsvmowzozprlhn.supabase.co";
const SUPABASE_KEY  = process.env.SUPABASE_SERVICE_KEY;

const sb = async (path, method, body) => {
  method = method || "GET";
  const opts = {
    method: method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": method === "POST" ? "resolution=merge-duplicates,return=representation" : ""
    }
  };
  if (body) opts.body = JSON.stringify(body);
  const r = await fetch(SUPABASE_URL + "/rest/v1/" + path, opts);
  const data = await r.json();
  if (!r.ok) {
    console.error("Supabase error:", r.status, JSON.stringify(data));
    throw new Error(data.message || data.error || ("Supabase error " + r.status));
  }
  return data;
};

// Detect file format from magic bytes (first few bytes of file)
function detectFormatFromBuffer(buffer) {
  if (!buffer || buffer.length < 12) return null;
  const b = buffer;
  // MP3: starts with ID3 or 0xFF 0xFB/0xF3/0xF2
  if (b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) return "mp3";
  if (b[0] === 0xFF && (b[1] === 0xFB || b[1] === 0xF3 || b[1] === 0xF2 || b[1] === 0xE3)) return "mp3";
  // WAV: RIFF....WAVE
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
      b[8] === 0x57 && b[9] === 0x41 && b[10] === 0x56 && b[11] === 0x45) return "wav";
  // OGG: OggS
  if (b[0] === 0x4F && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53) return "ogg";
  // FLAC: fLaC
  if (b[0] === 0x66 && b[1] === 0x4C && b[2] === 0x61 && b[3] === 0x43) return "flac";
  // MP4/M4A/3GPP/AAC: ftyp box at offset 4
  if (b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) return "mp4";
  // WebM/MKV: EBML header
  if (b[0] === 0x1A && b[1] === 0x45 && b[2] === 0xDF && b[3] === 0xA3) return "webm";
  // AMR: starts with #!AMR
  if (b[0] === 0x23 && b[1] === 0x21 && b[2] === 0x41 && b[3] === 0x4D && b[4] === 0x52) return "amr";
  // AAC ADTS: 0xFF 0xF1 or 0xFF 0xF9
  if (b[0] === 0xFF && (b[1] === 0xF1 || b[1] === 0xF9)) return "aac";
  return null;
}

// Map MIME types and file extensions to a Whisper-compatible filename + contentType
function getWhisperFileInfo(originalname, mimetype, buffer) {
  const name = (originalname || "recording").toLowerCase();
  const ext = name.includes(".") ? name.split(".").pop() : "";
  
  // Try magic bytes first — most reliable for Android files with no extension
  const detected = buffer ? detectFormatFromBuffer(buffer) : null;
  if (detected) {
    const magicMap = {
      "mp3":  { filename: "recording.mp3",  contentType: "audio/mpeg" },
      "wav":  { filename: "recording.wav",  contentType: "audio/wav" },
      "ogg":  { filename: "recording.ogg",  contentType: "audio/ogg" },
      "flac": { filename: "recording.flac", contentType: "audio/flac" },
      "mp4":  { filename: "recording.m4a",  contentType: "audio/mp4" },
      "webm": { filename: "recording.webm", contentType: "audio/webm" },
      "amr":  { filename: "recording.m4a",  contentType: "audio/mp4" },
      "aac":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    };
    if (magicMap[detected]) return magicMap[detected];
  }

  // Whisper supported formats: flac, m4a, mp3, mp4, mpeg, mpga, oga, ogg, wav, webm
  // We map everything else to the closest compatible format

  const mimeMap = {
    // Already supported natively
    "audio/mpeg":        { filename: "recording.mp3",  contentType: "audio/mpeg" },
    "audio/mp3":         { filename: "recording.mp3",  contentType: "audio/mpeg" },
    "audio/mp4":         { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/x-m4a":       { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/m4a":         { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/wav":         { filename: "recording.wav",  contentType: "audio/wav" },
    "audio/x-wav":       { filename: "recording.wav",  contentType: "audio/wav" },
    "audio/wave":        { filename: "recording.wav",  contentType: "audio/wav" },
    "audio/ogg":         { filename: "recording.ogg",  contentType: "audio/ogg" },
    "audio/oga":         { filename: "recording.oga",  contentType: "audio/ogg" },
    "audio/flac":        { filename: "recording.flac", contentType: "audio/flac" },
    "audio/x-flac":      { filename: "recording.flac", contentType: "audio/flac" },
    "audio/webm":        { filename: "recording.webm", contentType: "audio/webm" },
    "video/webm":        { filename: "recording.webm", contentType: "audio/webm" },
    "video/mp4":         { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/opus":        { filename: "recording.ogg",  contentType: "audio/ogg" },
    // 3GPP — send as mp4, Whisper handles it
    "audio/3gpp":        { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/3gpp2":       { filename: "recording.m4a",  contentType: "audio/mp4" },
    "video/3gpp":        { filename: "recording.m4a",  contentType: "audio/mp4" },
    "video/3gpp2":       { filename: "recording.m4a",  contentType: "audio/mp4" },
    // AAC — send as m4a
    "audio/aac":         { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/x-aac":       { filename: "recording.m4a",  contentType: "audio/mp4" },
    // AMR — send as mp4 (best available without ffmpeg)
    "audio/amr":         { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/amr-wb":      { filename: "recording.m4a",  contentType: "audio/mp4" },
    // WMA — send as mp4
    "audio/x-ms-wma":    { filename: "recording.m4a",  contentType: "audio/mp4" },
    "audio/wma":         { filename: "recording.m4a",  contentType: "audio/mp4" },
  };

  // Extension fallback map (in case browser sends wrong/missing MIME)
  const extMap = {
    "mp3":  { filename: "recording.mp3",  contentType: "audio/mpeg" },
    "m4a":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "mp4":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "wav":  { filename: "recording.wav",  contentType: "audio/wav" },
    "ogg":  { filename: "recording.ogg",  contentType: "audio/ogg" },
    "oga":  { filename: "recording.oga",  contentType: "audio/ogg" },
    "flac": { filename: "recording.flac", contentType: "audio/flac" },
    "webm": { filename: "recording.webm", contentType: "audio/webm" },
    "opus": { filename: "recording.ogg",  contentType: "audio/ogg" },
    "aac":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "3gp":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "3gpp": { filename: "recording.m4a",  contentType: "audio/mp4" },
    "3g2":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "amr":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "wma":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "caf":  { filename: "recording.m4a",  contentType: "audio/mp4" },
    "aiff": { filename: "recording.wav",  contentType: "audio/wav" },
    "aif":  { filename: "recording.wav",  contentType: "audio/wav" },
    "mpeg": { filename: "recording.mpeg", contentType: "audio/mpeg" },
    "mpga": { filename: "recording.mpga", contentType: "audio/mpeg" },
  };

  // Try MIME type first, then extension fallback
  if (mimetype && mimeMap[mimetype]) return mimeMap[mimetype];
  if (ext && extMap[ext]) return extMap[ext];

  // Default: treat as mp4 (most universal for Whisper)
  return { filename: "recording.m4a", contentType: "audio/mp4" };
}

app.get("/", function(req, res) {
  res.json({ status: "SalesCoach Server running", supabase: !!SUPABASE_KEY });
});

app.get("/users", async function(req, res) {
  try { res.json(await sb("sc_users?select=*")); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/users/bulk", async function(req, res) {
  try { res.json(await sb("sc_users", "POST", req.body)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.put("/users/:id", async function(req, res) {
  try { res.json(await sb("sc_users?id=eq." + req.params.id, "PATCH", req.body)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/users/:id", async function(req, res) {
  try { await sb("sc_users?id=eq." + req.params.id, "DELETE"); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/teams", async function(req, res) {
  try { res.json(await sb("sc_teams?select=*")); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/teams/bulk", async function(req, res) {
  try { res.json(await sb("sc_teams", "POST", req.body)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/logs", async function(req, res) {
  try { res.json(await sb("sc_logs?select=*")); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/logs", async function(req, res) {
  try { res.json(await sb("sc_logs", "POST", req.body)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch("/logs/:id", async function(req, res) {
  try { res.json(await sb("sc_logs?id=eq." + req.params.id, "PATCH", req.body)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/logs/:id", async function(req, res) {
  try { await sb("sc_logs?id=eq." + req.params.id, "DELETE"); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/reports", async function(req, res) {
  try { res.json(await sb("sc_reports?select=*")); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/reports", async function(req, res) {
  try { res.json(await sb("sc_reports", "POST", req.body)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/reports/:id", async function(req, res) {
  try { await sb("sc_reports?id=eq." + req.params.id, "DELETE"); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.get("/noanswers", async function(req, res) {
  try { res.json(await sb("sc_noanswers?select=*")); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/noanswers", async function(req, res) {
  try { res.json(await sb("sc_noanswers", "POST", req.body)); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/noanswers/:id", async function(req, res) {
  try { await sb("sc_noanswers?id=eq." + req.params.id, "DELETE"); res.json({ ok: true }); }
  catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Goals: stored in sc_goals Supabase table with 'data' JSONB column
// Table schema needed: id TEXT PRIMARY KEY, data JSONB
// Run this in Supabase SQL editor:
// CREATE TABLE IF NOT EXISTS sc_goals (id TEXT PRIMARY KEY, data JSONB);

async function sbGoalsGet() {
  const r = await fetch(SUPABASE_URL + "/rest/v1/sc_goals?select=id,data", {
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
  });
  const rows = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(rows));
  // Unwrap: return array of goal objects (stored in data column)
  return rows.map(row => ({ ...row.data, id: row.id }));
}

async function sbGoalPost(goal) {
  const row = { id: goal.id, data: goal };
  const r = await fetch(SUPABASE_URL + "/rest/v1/sc_goals", {
    method: "POST",
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": "Bearer " + SUPABASE_KEY,
      "Content-Type": "application/json",
      "Prefer": "resolution=merge-duplicates,return=representation"
    },
    body: JSON.stringify(row)
  });
  const result = await r.json();
  if (!r.ok) throw new Error(JSON.stringify(result));
  return goal;
}

async function sbGoalDelete(id) {
  const r = await fetch(SUPABASE_URL + "/rest/v1/sc_goals?id=eq." + id, {
    method: "DELETE",
    headers: { "apikey": SUPABASE_KEY, "Authorization": "Bearer " + SUPABASE_KEY }
  });
  if (!r.ok) {
    const err = await r.json().catch(() => ({}));
    throw new Error(JSON.stringify(err));
  }
}

app.get("/goals", async function(req, res) {
  try {
    const goals = await sbGoalsGet();
    res.json(goals);
  } catch(e) {
    console.error("GET goals error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.get("/goals/test-columns", async function(req, res) {
  try {
    const goals = await sbGoalsGet();
    res.json({ storage: "supabase", count: goals.length, goals: goals });
  } catch(e) {
    res.json({ error: e.message, hint: "Run in Supabase SQL editor: CREATE TABLE IF NOT EXISTS sc_goals (id TEXT PRIMARY KEY, data JSONB);" });
  }
});

app.post("/goals", async function(req, res) {
  try {
    const goal = await sbGoalPost(req.body);
    res.json(goal);
  } catch(e) {
    console.error("POST goals error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

app.delete("/goals/:id", async function(req, res) {
  try {
    await sbGoalDelete(req.params.id);
    res.json({ ok: true });
  } catch(e) {
    console.error("DELETE goal error:", e.message);
    res.status(500).json({ error: e.message });
  }
});

// Compress + convert audio buffer to speech-optimised MP3 using ffmpeg.
// Settings: mono, 16kHz, 32kbps — perfect for Nigerian speech, ~80% smaller than source.
// A 15-min call shrinks from ~15MB → ~3MB, cutting Whisper time from ~5min → ~75sec.
function convertToMp3(inputBuffer, inputExt) {
  return new Promise(function(resolve, reject) {
    const tmpDir = os.tmpdir();
    const inputPath = path.join(tmpDir, "sc_input_" + Date.now() + "." + (inputExt || "tmp"));
    const outputPath = path.join(tmpDir, "sc_output_" + Date.now() + ".mp3");
    fs.writeFileSync(inputPath, inputBuffer);
    const originalKB = (inputBuffer.length / 1024).toFixed(0);
    execFile(ffmpegPath, [
      "-y",
      "-i", inputPath,
      "-vn",               // no video stream
      "-ar", "16000",      // 16kHz — Whisper's native sample rate
      "-ac", "1",          // mono — halves size, no quality loss for speech
      "-b:a", "32k",       // 32kbps — ideal for speech (was 64k, now 2x smaller)
      "-map_metadata", "-1", // strip metadata tags
      outputPath
    ], function(err, stdout, stderr) {
      try { fs.unlinkSync(inputPath); } catch(e) {}
      if (err) {
        try { fs.unlinkSync(outputPath); } catch(e) {}
        return reject(new Error("ffmpeg conversion failed: " + stderr));
      }
      const mp3Buffer = fs.readFileSync(outputPath);
      try { fs.unlinkSync(outputPath); } catch(e) {}
      const compressedKB = (mp3Buffer.length / 1024).toFixed(0);
      const saving = (((inputBuffer.length - mp3Buffer.length) / inputBuffer.length) * 100).toFixed(0);
      console.log("[Audio] " + originalKB + "KB → " + compressedKB + "KB (" + saving + "% smaller)");
      resolve(mp3Buffer);
    });
  });
}

// Whisper-native formats that don't need conversion
const WHISPER_NATIVE = ["mp3","mp4","mpeg","mpga","m4a","wav","ogg","oga","flac","webm"];

function needsConversion(originalname, mimetype) {
  // ALWAYS compress through ffmpeg for speed — even native formats benefit
  // from mono + 16kHz + 32kbps resampling before hitting Whisper.
  // The only exception: if ffmpegPath is unavailable (handled in the route).
  return true;
}

app.post("/transcribe", upload.single("audio"), async function(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file." });
    if (!OPENAI_KEY) return res.status(500).json({ error: "OpenAI key missing." });

    let audioBuffer = req.file.buffer;
    let filename = "recording.mp3";
    let contentType = "audio/mpeg";

    // Compress ALL audio through ffmpeg: mono, 16kHz, 32kbps
    // This alone cuts a 15-min call from ~15MB → ~3MB → ~75sec processing
    const origExt = (req.file.originalname || "audio").toLowerCase().split(".").pop() || "m4a";
    try {
      audioBuffer = await convertToMp3(req.file.buffer, origExt);
      filename = "recording.mp3";
      contentType = "audio/mpeg";
    } catch(convErr) {
      // ffmpeg failed — fall back to original file, log clearly
      console.error("[Audio] Compression failed, sending original to Whisper:", convErr.message);
      const fileInfo = getWhisperFileInfo(req.file.originalname, req.file.mimetype, req.file.buffer);
      filename = fileInfo.filename;
      contentType = fileInfo.contentType;
    }

    const form = new FormData();
    form.append("file", audioBuffer, { filename, contentType });
    form.append("model", "whisper-1");
    form.append("prompt", "Nigerian sales call. May contain English, Pidgin, Yoruba, Igbo, or Hausa.");

    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: "Bearer " + OPENAI_KEY, ...form.getHeaders() },
      body: form
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error ? data.error.message : "Whisper error." });
    res.json({ transcript: data.text });
  } catch(e) {
    res.status(500).json({ error: "Transcription failed: " + e.message });
  }
});

// ── /analyze — FAST path: scores, verdict, coaching only (no resources)
// Returns in ~8-12 sec. Resources are fetched separately via /analyze-resources.
app.post("/analyze", async function(req, res) {
  try {
    const t = req.body;
    if (!t.transcript) return res.status(400).json({ error: "No transcript." });
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Anthropic key missing." });
    const desc = t.teamType === "socialmedia" ? "SOCIAL MEDIA closer" : t.teamType === "followup" ? "FOLLOW-UP closer" : "SALES closer";

    const prompt = `You are an expert Nigerian sales call coach for a wellness ecommerce company (payment-on-delivery). This closer is a ${desc}.

Analyze this call and return ONLY valid JSON — no markdown, no backticks, no explanation.

Closer: ${t.closerName} | Type: ${t.callType} | Outcome: ${t.callOutcome} | Product: ${t.product || "Wellness product"}
Languages may include English, Pidgin, Yoruba, Igbo, Hausa.

TRANSCRIPT:
${t.transcript}

Return this exact JSON structure:
{
  "overallScore": <0-100>,
  "closingRate": "<e.g. 70%>",
  "callDuration": "<e.g. 4m30s>",
  "verdict": "<1 punchy sentence>",
  "languageNote": "<languages detected + code-switching observations>",
  "metrics": [
    {"label": "Opening & Rapport", "score": <0-100>},
    {"label": "Needs Discovery", "score": <0-100>},
    {"label": "Product Pitch", "score": <0-100>},
    {"label": "Objection Handling", "score": <0-100>},
    {"label": "Urgency Creation", "score": <0-100>},
    {"label": "Close Attempt", "score": <0-100>}
  ],
  "strengths": ["<specific strength 1>", "<specific strength 2>", "<specific strength 3>"],
  "weaknesses": ["<specific weakness 1>", "<specific weakness 2>", "<specific weakness 3>"],
  "improvements": ["<actionable step with example dialogue>", "<actionable step>", "<actionable step>"],
  "transcriptInsight": "<the single most critical missed moment and exactly what should have been said>",
  "scriptSuggestion": "<a 3-5 line script in natural Nigerian sales English they can memorize>"
}`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error ? data.error.message : "Claude error." });
    const text = data.content.map(function(b) { return b.text || ""; }).join("").replace(/```json|```/g, "").trim();
    res.json({ analysis: JSON.parse(text) });
  } catch(e) { res.status(500).json({ error: "Analysis failed: " + e.message }); }
});

// ── /analyze-resources — SLOW path: books, YouTube, podcasts
// Called separately AFTER the main result is already shown to the user.
// Uses Sonnet for better resource quality. Mobile calls this in background.
app.post("/analyze-resources", async function(req, res) {
  try {
    const { weaknesses, closerName } = req.body;
    if (!weaknesses || !weaknesses.length) return res.status(400).json({ error: "No weaknesses provided." });
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Anthropic key missing." });

    const prompt = `You are a Nigerian sales training coach. Based on these weaknesses for closer ${closerName || "the closer"}:
${weaknesses.map(function(w, i) { return (i+1) + ". " + w; }).join("\n")}

Return ONLY valid JSON — no markdown, no backticks, no explanation:
{
  "resources": {
    "books": [
      {"title": "<book title and author>", "reason": "<why it helps>", "link": "<real Amazon URL>"},
      {"title": "<book title and author>", "reason": "<why it helps>", "link": "<real Amazon URL>"}
    ],
    "youtube": [
      {"title": "<real YouTube video title>", "reason": "<why it helps>", "videoId": "<real 11-char video ID>"},
      {"title": "<real YouTube video title>", "reason": "<why it helps>", "videoId": "<real 11-char video ID>"}
    ],
    "podcasts": [
      {"title": "<episode title>", "show": "<show name>", "reason": "<why it helps>", "link": "<real Spotify URL>"},
      {"title": "<episode title>", "show": "<show name>", "reason": "<why it helps>", "link": "<real Spotify URL>"}
    ]
  }
}`;

    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error ? data.error.message : "Claude error." });
    const text = data.content.map(function(b) { return b.text || ""; }).join("").replace(/```json|```/g, "").trim();
    res.json(JSON.parse(text));
  } catch(e) { res.status(500).json({ error: "Resources failed: " + e.message }); }
});

app.post("/analyze-summary", async function(req, res) {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "No prompt." });
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Anthropic key missing." });
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2000,
        messages: [{ role: "user", content: prompt }]
      })
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error ? data.error.message : "Claude error." });
    const text = data.content.map(function(b) { return b.text || ""; }).join("").replace(/```json|```/g, "").trim();
    res.json({ analysis: JSON.parse(text) });
  } catch(e) { res.status(500).json({ error: "Summary failed: " + e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() { console.log("SalesCoach server on port " + PORT); });
