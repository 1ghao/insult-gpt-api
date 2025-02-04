const fs = require("fs");
const https = require("https");
const express = require("express");
const cors = require("cors");
const { OpenAI } = require("openai");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());
app.use(cors({ origin: "*" }));

app.post("/api/chat", async (req, res) => {
  const { messages } = req.body;
  if (!Array.isArray(messages)) {
    return res.status(400).json({ error: "Invalid request format" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
    });
    return res.json({ response: completion.choices[0].message.content });
  } catch (error) {
    console.error("OpenAI API error:", error);
    return res.status(500).json({ error: "Error processing your request" });
  }
});

const httpsOptions = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/serverdewan.ddns.net/privkey.pem"
  ),
  cert: fs.readFileSync("/etc/letsencrypt/live/serverdewan.ddns.net/cert.pem"),
  ca: fs.readFileSync("/etc/letsencrypt/live/serverdewan.ddns.net/chain.pem"),
};

https.createServer(httpsOptions, app).listen(port, () => {
  console.log(`HTTPS Server running on port ${port}`);
});
