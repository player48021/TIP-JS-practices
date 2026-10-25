import assert from "node:assert/strict";
import { initialTasks } from "../src/data.js";
import { createTask, toggleTask, deleteTask, getTaskStats } from "../src/task-service.js";
import { getVisibleTasks } from "../src/task-selectors.js";

const created = createTask(20, "  Проверить работу  ", "high");
assert.equal(created.ok, true);
assert.equal(created.task.title, "Проверить работу");
assert.equal(createTask(21, "   ").ok, false);
assert.equal(createTask(22, "Корректная задача", "urgent").ok, false);

const tasks = initialTasks.map((task) => ({ ...task }));
assert.equal(getVisibleTasks(tasks, "pending").every((task) => !task.completed), true);
assert.equal(getVisibleTasks(tasks, "completed").every((task) => task.completed), true);
assert.equal(toggleTask(tasks, 4).tasks.find((task) => task.id === 4).completed, true);
assert.equal(deleteTask(tasks, 4).tasks.some((task) => task.id === 4), false);
assert.deepEqual(getTaskStats([]), { total: 0, completed: 0, pending: 0, percentage: 0 });
console.log("ПР3: все автоматические проверки пройдены.");
