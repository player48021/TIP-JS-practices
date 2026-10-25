import http from "node:http";
import { tasks, categories } from "./data.js";
const port = Number(process.argv[2] || 5505);
const json = (res, status, payload) => {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(payload));
};
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (req.method !== "GET") return json(res, 405, { error: { code: "METHOD_NOT_ALLOWED", message: "Only GET is supported" } });
  if (url.pathname === "/api/health") return json(res, 200, { status: "ok" });
  if (url.pathname === "/api/categories") return json(res, 200, { data: categories, meta: { total: categories.length } });
  if (url.pathname === "/api/tasks") {
    let result = [...tasks];
    if (url.searchParams.has("completed")) result = result.filter(t => String(t.completed) === url.searchParams.get("completed"));
    if (url.searchParams.has("priority")) result = result.filter(t => t.priority === url.searchParams.get("priority"));
    if (url.searchParams.has("categoryId")) result = result.filter(t => t.categoryId === Number(url.searchParams.get("categoryId")));
    if (url.searchParams.has("q")) result = result.filter(t => t.title.toLowerCase().includes(url.searchParams.get("q").toLowerCase()));
    return json(res, 200, { data: result, meta: { total: result.length } });
  }
  const match = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (match) {
    const task = tasks.find(t => t.id === Number(match[1]));
    return task ? json(res, 200, { data: task }) : json(res, 404, { error: { code: "TASK_NOT_FOUND", message: "Задача не найдена" } });
  }
  if (url.pathname === "/api/debug/delay") {
    const ms = Math.min(3000, Math.max(0, Number(url.searchParams.get("ms") || 100)));
    return setTimeout(() => json(res, 200, { delay: ms }), ms);
  }
  return json(res, 404, { error: { code: "NOT_FOUND", message: "Маршрут не найден" } });
});
server.listen(port, "127.0.0.1", () => console.log(`API: http://127.0.0.1:${port}/api`));
