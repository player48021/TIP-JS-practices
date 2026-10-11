import { demoTasks, variantTasks, variantNumber } from "./data.js";
import {
  createTask, addTask, deleteTask, toggleTask,
  getVisibleTasks, getTaskStats, findTaskById
} from "./task-service.js";

let tasks = [...demoTasks, ...variantTasks].map((task) => ({ ...task }));

console.log(`Практическая работа №2. Вариант ${variantNumber}`);
console.log("Начальный список:", tasks);

const created = createTask(20, "  Подготовить демонстрацию  ", "medium");
if (created.ok) {
  const result = addTask(tasks, created.task);
  if (result.ok) tasks = result.tasks;
  else console.error(result.error);
} else {
  console.error(created.error);
}

const toggled = toggleTask(tasks, 4);
if (toggled.ok) tasks = toggled.tasks;

console.log("Найденная задача:", findTaskById(tasks, 4));
console.log("Невыполненные задачи:", getVisibleTasks(tasks, "pending"));
console.log("Статистика:", getTaskStats(tasks));

const deleted = deleteTask(tasks, 7);
if (deleted.ok) tasks = deleted.tasks;
console.log("После удаления задачи 7:", tasks);
