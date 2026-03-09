const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

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
  return r.json();
};

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

app.post("/transcribe", upload.single("audio"), async function(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file." });
    if (!OPENAI_KEY) return res.status(500).json({ error: "OpenAI key missing." });
    const form = new FormData();
    form.append("file", req.file.buffer, { filename: req.file.originalname || "recording.mp3", contentType: req.file.mimetype || "audio/mpeg" });
    form.append("model", "whisper-1");
    form.append("prompt", "Nigerian sales call. May contain English, Pidgin, Yoruba, Igbo, or Hausa.");
    const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: "Bearer " + OPENAI_KEY, ...form.getHeaders() }, body: form
    });
    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data.error ? data.error.message : "Whisper error." });
    res.json({ transcript: data.text });
  } catch(e) { res.status(500).json({ error: "Transcription failed." }); }
});

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
  "scriptSuggestion": "<a 3-5 line script in natural Nigerian sales English they can memorize>",
  "resources": {
    "books": [
      {
        "title": "<exact book title and author>",
        "reason": "<why this specific book helps with their weakness>",
        "link": "<real Amazon or Google Books purchase URL for this exact book>"
      },
      {
        "title": "<exact book title and author>",
        "reason": "<why this book helps>",
        "link": "<real Amazon purchase URL>"
      }
    ],
    "youtube": [
      {
        "title": "<exact title of a real YouTube video that exists>",
        "reason": "<why this video helps with their specific weakness>",
        "videoId": "<the actual 11-character YouTube video ID, e.g. dQw4w9WgXcQ>"
      },
      {
        "title": "<exact title of a real YouTube video>",
        "reason": "<why this video helps>",
        "videoId": "<actual 11-character YouTube video ID>"
      }
    ],
    "podcasts": [
      {
        "title": "<exact podcast episode title>",
        "show": "<podcast show name>",
        "reason": "<why this episode helps>",
        "link": "<real Spotify or Apple Podcasts URL for this episode>"
      },
      {
        "title": "<exact podcast episode title>",
        "show": "<podcast show name>",
        "reason": "<why this helps>",
        "link": "<real Spotify or Apple Podcasts URL>"
      }
    ]
  }
}

IMPORTANT: For YouTube, provide REAL video IDs of videos that actually exist on YouTube about sales training. For books, use real Amazon links. For podcasts, use real Spotify links. Be specific and accurate.`;

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
  } catch(e) { res.status(500).json({ error: "Analysis failed: " + e.message }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, function() { console.log("SalesCoach server on port " + PORT); });
