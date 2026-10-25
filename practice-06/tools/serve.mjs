import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
const root = path.resolve(".");
const types = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8" };
const server = http.createServer(async (req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
  const relative = pathname === "/" ? "index.html" : pathname.slice(1);
  const file = path.resolve(root, relative);
  if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403).end("Forbidden"); return; }
  try {
    const content = await readFile(file);
    res.writeHead(200, { "Content-Type": types[path.extname(file)] || "application/octet-stream" });
    res.end(content);
  } catch { res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Файл не найден"); }
});
server.listen(5506, "127.0.0.1", () => console.log("Web: http://127.0.0.1:5506"));
