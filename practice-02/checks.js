import assert from "node:assert/strict";
import { demoTasks } from "./src/data.js";
import {
  createTask, addTask, deleteTask, toggleTask,
  getVisibleTasks, getTaskStats, findTaskById
} from "./src/task-service.js";

const created = createTask(20, "  Тестовая задача  ");
assert.equal(created.ok, true);
assert.deepEqual(created.task, {
  id: 20, title: "Тестовая задача", completed: false, priority: "medium"
});
assert.equal(createTask(0, "Ошибка").ok, false);
assert.equal(createTask(21, "   ").ok, false);
assert.equal(createTask(22, "Неверный приоритет", "urgent").ok, false);

const added = addTask(demoTasks, created.task);
assert.equal(added.ok, true);
assert.equal(added.tasks.length, demoTasks.length + 1);
assert.equal(addTask(added.tasks, created.task).ok, false);
assert.equal(findTaskById(demoTasks, 4).title, "Подготовить отчёт");

const toggled = toggleTask(demoTasks, 4);
assert.equal(toggled.ok, true);
assert.equal(toggled.tasks.find((task) => task.id === 4).completed, true);
assert.equal(demoTasks.find((task) => task.id === 4).completed, false);

assert.equal(deleteTask(demoTasks, 999).ok, false);
assert.equal(getVisibleTasks(demoTasks, "pending").length, 2);
assert.equal(getVisibleTasks(demoTasks, "completed").length, 2);
assert.deepEqual(getTaskStats(demoTasks), {
  total: 4, completed: 2, pending: 2, percentage: 50
});

console.log("Все проверки ПР2 пройдены.");
