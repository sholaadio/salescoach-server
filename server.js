const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fetch = require("node-fetch");
const FormData = require("form-data");

const app = express();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

app.use(cors());
app.use(express.json({ limit: "2mb" }));

const OPENAI_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;

// Health check
app.get("/", (req, res) => {
  res.json({ status: "SalesCoach Server running ✅", whisper: !!OPENAI_KEY, claude: !!ANTHROPIC_KEY });
});

// ─── TRANSCRIBE AUDIO WITH WHISPER ───────────────────────────────────────────
app.post("/transcribe", upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No audio file uploaded." });
    if (!OPENAI_KEY) return res.status(500).json({ error: "OpenAI API key not configured on server." });

    const form = new FormData();
    form.append("file", req.file.buffer, {
      filename: req.file.originalname || "recording.mp3",
      contentType: req.file.mimetype || "audio/mpeg",
    });
    form.append("model", "whisper-1");
    form.append("prompt", "This is a Nigerian sales call. May contain English, Pidgin, Yoruba, Igbo, or Hausa.");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${OPENAI_KEY}`, ...form.getHeaders() },
      body: form,
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Whisper error." });

    res.json({ transcript: data.text });
  } catch (err) {
    console.error("Transcribe error:", err);
    res.status(500).json({ error: "Transcription failed. Try again." });
  }
});

// ─── ANALYZE WITH CLAUDE ──────────────────────────────────────────────────────
app.post("/analyze", async (req, res) => {
  try {
    const { transcript, closerName, callType, callOutcome, product, teamType } = req.body;
    if (!transcript) return res.status(400).json({ error: "No transcript provided." });
    if (!ANTHROPIC_KEY) return res.status(500).json({ error: "Anthropic API key not configured on server." });

    const desc =
      teamType === "socialmedia"
        ? "SOCIAL MEDIA closer — calls leads from Facebook/Instagram/TikTok comment sections, DMs, and WhatsApp. Leads are warm but informal."
        : teamType === "followup"
        ? "FOLLOW-UP closer — calls old/cold orders that were previously unreachable."
        : "closer calling customers who filled forms on Facebook/TikTok funnels.";

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": ANTHROPIC_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1200,
        messages: [
          {
            role: "user",
            content: `You are an expert Nigerian sales call coach for a wellness ecommerce company (payment-on-delivery). This closer is a ${desc}

Analyze this call. Return ONLY valid JSON — no markdown, no backticks.

CONTEXT: Closer: ${closerName} | Type: ${callType === "whatsapp" ? "WhatsApp" : "Phone"} | Outcome: ${callOutcome} | Product: ${product || "Wellness product"}
Languages may include English, Pidgin, Yoruba, Igbo, Hausa.

TRANSCRIPT:
${transcript}

JSON:
{"overallScore":<0-100>,"closingRate":"<e.g.70%>","callDuration":"<e.g.4m30s>","verdict":"<1 punchy sentence>","languageNote":"<languages + code-switching>","metrics":[{"label":"Opening & Rapport","score":<0-100>},{"label":"Needs Discovery","score":<0-100>},{"label":"Product Pitch","score":<0-100>},{"label":"Objection Handling","score":<0-100>},{"label":"Urgency Creation","score":<0-100>},{"label":"Close Attempt","score":<0-100>}],"strengths":["<specific>","<specific>","<specific>"],"weaknesses":["<specific>","<specific>","<specific>"],"improvements":["<actionable with example>","<actionable>","<actionable>"],"transcriptInsight":"<critical missed moment + what should have been said>","scriptSuggestion":"<2-4 line script in natural Nigerian sales English>","resources":{"books":[{"title":"<title by author>","reason":"<why>"},{"title":"<title>","reason":"<why>"}],"youtube":[{"title":"<search term>","reason":"<why>"},{"title":"<search term>","reason":"<why>"}],"podcasts":[{"title":"<podcast name>","reason":"<why>"},{"title":"<podcast name>","reason":"<why>"}]}}`,
          },
        ],
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json({ error: data?.error?.message || "Claude error." });

    const text = data.content.map((b) => b.text || "").join("").replace(/```json|```/g, "").trim();
    const analysis = JSON.parse(text);
    res.json({ analysis });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Analysis failed. Try again." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SalesCoach server running on port ${PORT}`));
