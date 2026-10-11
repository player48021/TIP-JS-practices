import { ApiError } from "./api-client.js";
function invalid(message, url) { return new ApiError("invalid-response", message, { url }); }
function isTask(task) {
  return task && Number.isSafeInteger(task.id) && task.id > 0 &&
    typeof task.title === "string" && typeof task.completed === "boolean" &&
    ["low", "medium", "high"].includes(task.priority) &&
    Number.isSafeInteger(task.categoryId);
}
function isCategory(category) {
  return category && Number.isSafeInteger(category.id) && category.id > 0 &&
    typeof category.name === "string" && category.name.length > 0;
}
export function createTaskApi(client) {
  if (!client || typeof client.requestJson !== "function") throw new TypeError("Нужен клиент с requestJson.");
  return {
    async getTasks(filters = {}) {
      const allowed = ["completed", "priority", "categoryId", "q"];
      const query = {};
      for (const key of allowed) if (Object.hasOwn(filters, key)) query[key] = filters[key];
      if (query.completed !== undefined && typeof query.completed !== "boolean") throw new TypeError("completed должен быть boolean.");
      if (query.priority !== undefined && !["low", "medium", "high"].includes(query.priority)) throw new TypeError("Некорректный priority.");
      const payload = await client.requestJson("/tasks", { query });
      if (!Array.isArray(payload?.data) || !payload.data.every(isTask) ||
          new Set(payload.data.map(t => t.id)).size !== payload.data.length ||
          payload.meta?.total !== payload.data.length) throw invalid("Неверная схема списка задач.");
      return { tasks: payload.data, meta: payload.meta };
    },
    async getTaskById(id) {
      if (!Number.isSafeInteger(id) || id <= 0) throw new TypeError("ID должен быть положительным целым числом.");
      const payload = await client.requestJson(`/tasks/${id}`);
      if (!isTask(payload?.data)) throw invalid("Неверная схема задачи.");
      return payload.data;
    },
    async getCategories() {
      const payload = await client.requestJson("/categories");
      if (!Array.isArray(payload?.data) || !payload.data.every(isCategory) ||
          new Set(payload.data.map(c => c.id)).size !== payload.data.length ||
          payload.meta?.total !== payload.data.length) throw invalid("Неверная схема категорий.");
      return payload.data;
    }
  };
}
