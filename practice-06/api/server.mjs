import http from "node:http";
import { tasks, categories } from "./data.js";

let nextId = Math.max(0, ...tasks.map(task => task.id)) + 1;
const port = Number(process.env.API_PORT || process.argv[2] || 5507);

function send(res, status, payload) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Accept"
  });
  res.end(payload === null ? "" : JSON.stringify(payload));
}
async function readJson(req) {
  let raw = "";
  for await (const chunk of req) {
    raw += chunk;
    if (raw.length > 100_000) throw new Error("Тело запроса слишком большое.");
  }
  try { return JSON.parse(raw || "{}"); }
  catch { throw new Error("Тело запроса должно быть корректным JSON."); }
}
function validDraft(body) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const priority = body.priority ?? "medium";
  const categoryId = Number(body.categoryId ?? 1);
  if (!title || title.length > 100) return { error: "Название должно содержать от 1 до 100 символов." };
  if (!["low", "medium", "high"].includes(priority)) return { error: "Некорректный приоритет." };
  if (!categories.some(category => category.id === categoryId)) return { error: "Категория не найдена." };
  return { value: { title, priority, categoryId } };
}
function matches(task, url) {
  if (url.searchParams.has("completed") && String(task.completed) !== url.searchParams.get("completed")) return false;
  if (url.searchParams.has("priority") && task.priority !== url.searchParams.get("priority")) return false;
  if (url.searchParams.has("categoryId") && task.categoryId !== Number(url.searchParams.get("categoryId"))) return false;
  if (url.searchParams.has("q") && !task.title.toLowerCase().includes(url.searchParams.get("q").toLowerCase())) return false;
  return true;
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (req.method === "OPTIONS") return send(res, 204, null);
  if (url.pathname === "/api/health" && req.method === "GET") return send(res, 200, { status: "ok" });
  if (url.pathname === "/api/categories" && req.method === "GET") return send(res, 200, { data: categories, meta: { total: categories.length } });
  if (url.pathname === "/api/tasks" && req.method === "GET") {
    const result = tasks.filter(task => matches(task, url));
    return send(res, 200, { data: result, meta: { total: result.length } });
  }
  if (url.pathname === "/api/tasks" && req.method === "POST") {
    try {
      const body = await readJson(req);
      const validation = validDraft(body);
      if (validation.error) return send(res, 400, { error: { code: "VALIDATION_ERROR", message: validation.error } });
      const task = { id: nextId++, ...validation.value, completed: false };
      tasks.push(task);
      return send(res, 201, { data: task });
    } catch (error) {
      return send(res, 400, { error: { code: "INVALID_JSON", message: error.message } });
    }
  }
  const match = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
  if (match) {
    const id = Number(match[1]);
    const index = tasks.findIndex(task => task.id === id);
    if (index < 0) return send(res, 404, { error: { code: "TASK_NOT_FOUND", message: "Задача не найдена." } });
    if (req.method === "GET") return send(res, 200, { data: tasks[index] });
    if (req.method === "PATCH") {
      try {
        const body = await readJson(req);
        if (Object.hasOwn(body, "completed") && typeof body.completed !== "boolean") {
          return send(res, 400, { error: { code: "VALIDATION_ERROR", message: "completed должен быть boolean." } });
        }
        const draft = { ...tasks[index], ...body };
        const validation = validDraft(draft);
        if (validation.error) return send(res, 400, { error: { code: "VALIDATION_ERROR", message: validation.error } });
        tasks[index] = { ...tasks[index], ...validation.value,
          completed: Object.hasOwn(body, "completed") ? body.completed : tasks[index].completed };
        return send(res, 200, { data: tasks[index] });
      } catch (error) {
        return send(res, 400, { error: { code: "INVALID_JSON", message: error.message } });
      }
    }
    if (req.method === "DELETE") {
      const [deleted] = tasks.splice(index, 1);
      return send(res, 200, { data: deleted });
    }
    return send(res, 405, { error: { code: "METHOD_NOT_ALLOWED", message: "Метод не поддерживается." } });
  }
  return send(res, 404, { error: { code: "NOT_FOUND", message: "Маршрут не найден." } });
});
server.listen(port, "127.0.0.1", () => console.log(`API: http://127.0.0.1:${port}/api`));
