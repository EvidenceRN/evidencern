"use strict";
/* EvidenceRN server.
   Copyright 2026 Stephen Ferrara. Licensed under the Apache License, Version 2.0.
   SPDX-License-Identifier: Apache-2.0

   Zero dependencies. Requires Node 18+.
   Serves the UI from ./public and exposes POST /api/ask, which forwards
   a synthesis prompt to the Claude API using the key in .env. */

const http = require("http");
const fs = require("fs");
const path = require("path");

// Minimal .env loader (KEY=value lines, # comments ignored)
try {
  fs.readFileSync(path.join(__dirname, ".env"), "utf8").split("\n").forEach(line => {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !line.trim().startsWith("#") && !process.env[m[1]]) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  });
} catch (e) { /* no .env yet — synthesis stays disabled until one exists */ }

const PORT = parseInt(process.env.PORT || "3000", 10);
const KEY = process.env.ANTHROPIC_API_KEY || "";
const MODEL = process.env.ANTHROPIC_MODEL || "claude-sonnet-5";
const PUB = path.join(__dirname, "public");
const MIME = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript",
  ".png": "image/png", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json" };

function send(res, code, body, type) {
  res.writeHead(code, { "Content-Type": type || "application/json; charset=utf-8" });
  res.end(body);
}

function handleAsk(req, res) {
  if (!KEY) {
    return send(res, 503, JSON.stringify({
      error: "No ANTHROPIC_API_KEY configured on the server. Copy .env.example to .env, paste your key, and restart."
    }));
  }
  let raw = "";
  req.on("data", c => { raw += c; if (raw.length > 2e6) req.destroy(); });
  req.on("end", async () => {
    try {
      const { prompt, data } = JSON.parse(raw || "{}");
      if (!prompt) return send(res, 400, JSON.stringify({ error: "missing prompt" }));
      const content = prompt + ((data && data.length) ? "\n\n--- DATA ---\n" + data.join("\n") : "");
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "x-api-key": KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: MODEL,
          max_tokens: 1500,
          messages: [{ role: "user", content: content }]
        })
      });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) {
        const msg = (j.error && j.error.message) || ("Claude API error " + r.status);
        return send(res, 502, JSON.stringify({ error: msg }));
      }
      const text = (j.content || []).map(b => b.text || "").join("");
      send(res, 200, JSON.stringify({ text: text }));
    } catch (e) {
      send(res, 500, JSON.stringify({ error: e.message || String(e) }));
    }
  });
}

const server = http.createServer((req, res) => {
  const u = new URL(req.url, "http://localhost");
  if (req.method === "POST" && u.pathname === "/api/ask") return handleAsk(req, res);
  let p = u.pathname === "/" ? "/index.html" : u.pathname;
  p = path.normalize(p).replace(/^(\.\.[\/\\])+/, "");
  const file = path.join(PUB, p);
  if (!file.startsWith(PUB)) return send(res, 403, "forbidden", "text/plain");
  fs.readFile(file, (err, buf) => {
    if (err) return send(res, 404, "not found", "text/plain");
    send(res, 200, buf, MIME[path.extname(file)] || "application/octet-stream");
  });
});

server.listen(PORT, () => {
  console.log("EvidenceRN running at http://localhost:" + PORT);
  if (!KEY) console.log("WARNING: no ANTHROPIC_API_KEY set. Search works; synthesis is disabled until you add a key to .env and restart.");
  else console.log("Synthesis model: " + MODEL);
});
