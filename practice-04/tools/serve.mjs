import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] || 5504);
const types = { ".html":"text/html; charset=utf-8", ".css":"text/css; charset=utf-8", ".js":"text/javascript; charset=utf-8", ".json":"application/json; charset=utf-8" };
http.createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const requestedPath = pathname === "/" ? "/index.html" : pathname;
    const target = path.resolve(root, "." + requestedPath);
    if (!target.startsWith(root)) throw new Error("Forbidden");
    const body = await readFile(target);
    res.writeHead(200, { "Content-Type": types[path.extname(target)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404, { "Content-Type":"text/plain; charset=utf-8" }); res.end("Not found");
  }
}).listen(port, "127.0.0.1", () => console.log(`Откройте http://127.0.0.1:${port}`));
