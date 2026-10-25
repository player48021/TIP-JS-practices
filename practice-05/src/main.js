import { createApiClient } from "./api-client.js";
import { createTaskApi } from "./task-api.js";
import { variant } from "./variant.js";

const client = createApiClient({
  baseUrl: process.env.API_URL || "http://127.0.0.1:5505/api",
  timeoutMs: 3000
});
const api = createTaskApi(client);

try {
  const [taskResult, categories] = await Promise.all([
    api.getTasks(variant.filters),
    api.getCategories()
  ]);
  console.log(`Практическая работа №5. Вариант ${variant.number}`);
  console.log("Фильтры:", variant.filters);
  console.log("Задачи:", taskResult.tasks);
  console.log("Категории:", categories);
  console.log("Статистика:", taskResult.meta);
  console.log("Задача по ID:", await api.getTaskById(variant.taskId));
} catch (error) {
  console.error(`Ошибка ${error.kind || "application"}: ${error.message}`);
  process.exitCode = 1;
}
