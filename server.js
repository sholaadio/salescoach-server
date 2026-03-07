const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: "4mb" }));

const OPENAI_KEY     = process.env.OPENAI_API_KEY;
const ANTHROPIC_KEY  = process.env.ANTHROPIC_API_KEY;
const SUPABASE_URL   = "https://dxlvsnlsvmowzozprlhn.supabase.co";
const SUPABASE_KEY   = process.env.SUPABASE_SERVICE_KEY; // service_role key

// ─── SUPABASE HELPER ──────────────────────────────────────────────────────────
const sb = (path, method="GET", body=null) => {
  const opts = {
    method,
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": method==="POST" ? "return=representation" : "",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  return fetch(`${SUPABASE_URL}/rest/v1/${path}`, opts).then(r => r.json());
};

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "SalesCoach Server running ✅", supabase: !!SUPABASE_KEY });
});

// ─── USERS ────────────────────────────────────────────────────────────────────
app.get("/users", async (req, res) => {
  try {
    const data = await sb("sc_users?select=*&order=created_at.asc");
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/users", async (req, res) => {
  try {
    const data = await sb("sc_users", "POST", req.body);
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.put("/users/:id", async (req, res) => {
  try {
    const data = await sb(`sc_users?id=eq.${req.params.id}`, "PATCH", req.body);
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/users/:id", async (req, res) => {
  try {
    await sb(`sc_users?id=eq.${req.params.id}`, "DELETE");
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// Bulk save users (replaces all - for compatibility)
app.post("/users/bulk", async (req, res) => {
  try {
    const users = req.body; // array
    // Upsert all
    const data = await fetch(`${SUPABASE_URL}/rest/v1/sc_users`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(users),
    }).then(r => r.json());
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── TEAMS ────────────────────────────────────────────────────────────────────
app.get("/teams", async (req, res) => {
  try {
    const data = await sb("sc_teams?select=*&order=id.asc");
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/teams/bulk", async (req, res) => {
  try {
    const data = await fetch(`${SUPABASE_URL}/rest/v1/sc_teams`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(req.body),
    }).then(r => r.json());
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── DAILY LOGS ───────────────────────────────────────────────────────────────
app.get("/logs", async (req, res) => {
  try {
    const data = await sb("sc_logs?select=*&order=submitted_at.desc");
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/logs", async (req, res) => {
  try {
    const data = await fetch(`${SUPABASE_URL}/rest/v1/sc_logs`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(req.body),
    }).then(r => r.json());
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.patch("/logs/:id", async (req, res) => {
  try {
    const data = await sb(`sc_logs?id=eq.${req.params.id}`, "PATCH", req.body);
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/logs/:id", async (req, res) => {
  try {
    await sb(`sc_logs?id=eq.${req.params.id}`, "DELETE");
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── CALL REPORTS ─────────────────────────────────────────────────────────────
app.get("/reports", async (req, res) => {
  try {
    const data = await sb("sc_reports?select=*&order=date.desc");
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/reports", async (req, res) => {
  try {
    const data = await fetch(`${SUPABASE_URL}/rest/v1/sc_reports`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(req.body),
    }).then(r => r.json());
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/reports/:id", async (req, res) => {
  try {
    await sb(`sc_reports?id=eq.${req.params.id}`, "DELETE");
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── NO ANSWERS ───────────────────────────────────────────────────────────────
app.get("/noanswers", async (req, res) => {
  try {
    const data = await sb("sc_noanswers?select=*&order=created_at.desc");
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.post("/noanswers", async (req, res) => {
  try {
    const data = await fetch(`${SUPABASE_URL}/rest/v1/sc_noanswers`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates,return=representation",
      },
      body: JSON.stringify(req.body),
    }).then(r => r.json());
    res.json(data);
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.delete("/noanswers/:id", async (req, res) => {
  try {
    await sb(`sc_noanswers?id=eq.${req.params.id}`, "DELETE");
    res.json({ ok: true });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ─── TRANSCRIBE AUDIO WITH WHISPER ───────────────────────────────────────────
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file uploaded." });
    if (!OPENAI_KEY) return res.status(500).json({ error: "OpenAI API key not configured." });
    const form = new FormData();
    form.append("file", req.file.buffer, { filename: req.file.originalname || "recording.mp3", contentType: req.file.mimetype || "audio/mpeg" });
    form.append("model", "whisper-1");
    form.append("prompt", "Nigerian sales call. May contain English, Pidgin, Yoruba, Igbo, or Hausa.");
    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST", headers: { Authorization: `Bearer ${OPENAI_KEY}`, ...form.getHeaders() }, body: form,
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Whisper error." });
    res.json({ transcript: data.text });
  } catch(err) { res.status(500).json({ error: "Transcription failed." }); }
});

// ─── ANALYZE WITH CLAUDE ──────────────────────────────────────────────────────
app.post("/analyze", async (req, res) => {
  try {
    const { transcript, closerName, callType, callOutcome, product, teamType } = req.body;
    if (!transcript) return res.status(400).json({ error: "No transcript provided." });
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Anthropic API key not configured." });
    const desc = teamType==="socialmedia" ? "SOCIAL MEDIA closer — calls leads from Facebook/Instagram/TikTok." : teamType==="followup" ? "FOLLOW-UP closer — calls old/cold orders." : "closer calling customers who filled forms on Facebook/TikTok funnels.";
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-api-key": ANTHROPIC_KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514", max_tokens: 1200,
        messages: [{ role: "user", content: `You are an expert Nigerian sales call coach for a wellness ecommerce company (payment-on-delivery). This closer is a ${desc}\n\nAnalyze this call. Return ONLY valid JSON — no markdown, no backticks.\n\nCONTEXT: Closer: ${closerName} | Type: ${callType==="whatsapp"?"WhatsApp":"Phone"} | Outcome: ${callOutcome} | Product: ${product||"Wellness product"}\nLanguages may include English, Pidgin, Yoruba, Igbo, Hausa.\n\nTRANSCRIPT:\n${transcript}\n\nJSON:\n{"overallScore":<0-100>,"closingRate":"<e.g.70%>","callDuration":"<e.g.4m30s>","verdict":"<1 punchy sentence>","languageNote":"<languages + code-switching>","metrics":[{"label":"Opening & Rapport","score":<0-100>},{"label":"Needs Discovery","score":<0-100>},{"label":"Product Pitch","score":<0-100>},{"label":"Objection Handling","score":<0-100>},{"label":"Urgency Creation","score":<0-100>},{"label":"Close Attempt","score":<0-100>}],"strengths":["<specific>","<specific>","<specific>"],"weaknesses":["<specific>","<specific>","<specific>"],"improvements":["<actionable with example>","<actionable>","<actionable>"],"transcriptInsight":"<critical missed moment + what should have been said>","scriptSuggestion":"<2-4 line script in natural Nigerian sales English>","resources":{"books":[{"title":"<title by author>","reason":"<why>"},{"title":"<title>","reason":"<why>"}],"youtube":[{"title":"<search term>","reason":"<why>"},{"title":"<search term>","reason":"<why>"}],"podcasts":[{"title":"<podcast name>","reason":"<why>"},{"title":"<podcast name>","reason":"<why>"}]}}` }]
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Claude error." });
    const text = data.content.map(b=>b.text||"").join("").replace(/```json|```/g,"").trim();
    res.json({ analysis: JSON.parse(text) });
  } catch(err) { res.status(500).json({ error: "Analysis failed." }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SalesCoach server running on port ${PORT}`));
