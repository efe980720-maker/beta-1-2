"use strict";

const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");

const projectRoot = __dirname;
const publicRoot = path.join(projectRoot, "public");
const port = Number(process.env.PORT || 3000);
const expectedChannelId = "1555688585317982218";
const maxRequestBytes = 16 * 1024;
const maxApplicationsPerMinute = 10;
const recentApplications = [];

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webp": "image/webp",
};

function sendJson(response, status, payload) {
  response.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  response.end(JSON.stringify(payload));
}

function safePath(requestPath) {
  const relativePath = path.posix.normalize(requestPath).replace(/^\.\//, "");
  if (relativePath === ".." || relativePath.startsWith("../") || path.posix.isAbsolute(relativePath)) return null;

  if (["index.html", "styles.css", "script.js"].includes(relativePath)) {
    return path.join(projectRoot, relativePath);
  }

  if (relativePath === "manus-routes.json" || relativePath.startsWith("assets/")) {
    const candidate = path.resolve(publicRoot, relativePath);
    if (candidate !== publicRoot && !candidate.startsWith(`${publicRoot}${path.sep}`)) return null;
    return candidate;
  }

  return null;
}

async function readJsonBody(request) {
  const contentType = String(request.headers["content-type"] || "").toLowerCase();
  if (!contentType.startsWith("application/json")) {
    request.resume();
    return { error: "Başvuru biçimi geçersiz." };
  }

  const chunks = [];
  let size = 0;
  let tooLarge = false;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > maxRequestBytes) tooLarge = true;
    else if (!tooLarge) chunks.push(chunk);
  }
  if (tooLarge) return { error: "Başvuru metni izin verilen sınırı aşıyor." };

  try {
    return { data: JSON.parse(Buffer.concat(chunks).toString("utf8")) };
  } catch {
    return { error: "Başvuru verisi okunamadı." };
  }
}

function validateAnswers(value) {
  const limits = { roblox: 64, discord: 100, terms: 900, knowledge: 900, past_places: 900 };
  if (!value || typeof value !== "object" || Array.isArray(value)) return { error: "Başvuru verisi geçersiz." };

  const answers = {};
  for (const [key, maximum] of Object.entries(limits)) {
    const answer = typeof value[key] === "string" ? value[key].trim() : "";
    if (!answer || answer.length > maximum) return { error: "Lütfen tüm soruları eksiksiz ve sınırlar içinde yanıtla." };
    answers[key] = answer;
  }

  const age = Number(value.age);
  if (!Number.isInteger(age) || age < 13 || age > 99) return { error: "Hesap yaşını 13–99 arasında tam sayı olarak gir." };
  if (!["1-2", "2-3", "4+"].includes(value.hours)) return { error: "Günlük aktiflik seçeneklerinden birini seç." };

  answers.age = String(age);
  answers.hours = value.hours;
  return { answers };
}

function escapeMentions(text) {
  return text.replace(/@(everyone|here)/gi, "@\u200b$1");
}

function webhookEndpoint() {
  const rawValue = process.env.DISCORD_APPLICATIONS_WEBHOOK_URL;
  if (!rawValue) return null;

  try {
    const parsed = new URL(rawValue.trim());
    const match = parsed.pathname.match(/^\/api\/webhooks\/(\d{15,25})\/([A-Za-z0-9._-]{20,})\/?$/);
    if (parsed.protocol !== "https:" || !["discord.com", "discordapp.com"].includes(parsed.hostname) || !match) return null;
    return `https://discord.com/api/webhooks/${match[1]}/${match[2]}`;
  } catch {
    return null;
  }
}

async function postApplication(answers) {
  const endpoint = webhookEndpoint();
  if (!endpoint) return { ok: false, status: 503, error: "Başvuru kanalı henüz güvenli şekilde yapılandırılmamış." };

  try {
    const verifyResponse = await fetch(endpoint, { signal: AbortSignal.timeout(7000) });
    if (!verifyResponse.ok) return { ok: false, status: 503, error: "Başvuru kanalı şu anda doğrulanamıyor. Lütfen daha sonra tekrar dene." };
    const webhook = await verifyResponse.json();
    if (webhook.channel_id !== expectedChannelId) {
      return { ok: false, status: 503, error: "Başvuru kanalı doğrulanamadı. Site yöneticisiyle iletişime geç." };
    }

    const fields = [
      ["Roblox Adın", answers.roblox],
      ["Discord Adın", answers.discord],
      ["FearRP, MetaGaming, PowerRP, New Life Rule, RDM nedir?", answers.terms],
      ["Beta-1 hakkında ne biliyorsun?", answers.knowledge],
      ["Daha önce görev yaptığın yerler?", answers.past_places],
      ["Hesap yaşın?", answers.age],
      ["Günde kaç saat aktif olabilirsin?", answers.hours],
    ];

    const payload = {
      username: "Beta-1 Başvuru Sistemi",
      allowed_mentions: { parse: [] },
      embeds: [{
        title: "Yeni Beta-1 başvurusu",
        description: "Beta-1 Resmi Site başvuru terminalinden gönderildi.",
        color: 0xd75e63,
        fields: fields.map(([name, value]) => ({ name, value: escapeMentions(value), inline: false })),
        footer: { text: "Başvurular / B1-14" },
        timestamp: new Date().toISOString(),
      }],
    };

    const sendResponse = await fetch(`${endpoint}?wait=true`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(9000),
    });
    if (!sendResponse.ok) {
      await sendResponse.text().catch(() => "");
      return { ok: false, status: 502, error: "Discord başvuruyu kabul etmedi. Lütfen daha sonra tekrar dene." };
    }

    const sentMessage = await sendResponse.json();
    if (sentMessage.channel_id !== expectedChannelId) {
      return { ok: false, status: 502, error: "Başvuru gönderimi doğrulanamadı. Site yöneticisiyle iletişime geç." };
    }
    return { ok: true };
  } catch {
    return { ok: false, status: 502, error: "Discord bağlantısı kurulamadı. Lütfen daha sonra tekrar dene." };
  }
}

async function handleApplication(request, response) {
  if (request.headers["sec-fetch-site"] === "cross-site") {
    sendJson(response, 403, { error: "Bu başvuru isteğine izin verilmiyor." });
    request.resume();
    return;
  }

  const now = Date.now();
  while (recentApplications.length && recentApplications[0] < now - 60_000) recentApplications.shift();
  if (recentApplications.length >= maxApplicationsPerMinute) {
    sendJson(response, 429, { error: "Çok kısa sürede fazla başvuru yapıldı. Bir dakika sonra tekrar dene." });
    request.resume();
    return;
  }

  const body = await readJsonBody(request);
  if (body.error) {
    sendJson(response, body.error.includes("sınırı") ? 413 : 400, { error: body.error });
    return;
  }

  const validation = validateAnswers(body.data);
  if (validation.error) {
    sendJson(response, 400, { error: validation.error });
    return;
  }

  recentApplications.push(now);
  const result = await postApplication(validation.answers);
  if (!result.ok) {
    sendJson(response, result.status, { error: result.error });
    return;
  }
  sendJson(response, 200, { ok: true });
}

const server = http.createServer(async (request, response) => {
  let requestUrl;
  let decodedPath;
  try {
    requestUrl = new URL(request.url, `http://${request.headers.host || "localhost"}`);
    decodedPath = decodeURIComponent(requestUrl.pathname);
  } catch {
    sendJson(response, 400, { error: "Geçersiz istek." });
    return;
  }

  if (decodedPath === "/_healthz" && request.method === "GET") {
    response.writeHead(200, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" });
    response.end("ok");
    return;
  }

  if (decodedPath === "/api/applications") {
    if (request.method !== "POST") {
      sendJson(response, 405, { error: "Bu istek yöntemi desteklenmiyor." });
      return;
    }
    await handleApplication(request, response);
    return;
  }

  if (request.method !== "GET" && request.method !== "HEAD") {
    sendJson(response, 405, { error: "Bu istek yöntemi desteklenmiyor." });
    return;
  }

  const relativePath = decodedPath === "/" ? "index.html" : decodedPath.replace(/^\/+/, "");
  const candidate = safePath(relativePath);
  if (!candidate || !fs.existsSync(candidate) || !fs.statSync(candidate).isFile()) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store", "X-Content-Type-Options": "nosniff" });
    response.end("Not Found");
    return;
  }
  const sourceFile = candidate;

  response.writeHead(200, {
    "Content-Type": mimeTypes[path.extname(sourceFile).toLowerCase()] || "application/octet-stream",
    "Cache-Control": sourceFile.endsWith("index.html") ? "no-cache" : "public, max-age=3600",
    "X-Content-Type-Options": "nosniff",
  });
  if (request.method === "HEAD") response.end();
  else fs.createReadStream(sourceFile).pipe(response);
});

server.listen(port, "0.0.0.0", () => {
  console.log(`Beta-1 portalı http://0.0.0.0:${port} üzerinde hazır.`);
});
