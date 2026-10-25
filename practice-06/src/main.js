import { createApiClient } from "./api-client.js";

const api = createApiClient();
const list = document.querySelector("#tasks");
const form = document.querySelector("#task-form");
const status = document.querySelector("#status");
const search = document.querySelector("#search");
const filter = document.querySelector("#filter");
const category = document.querySelector("#category");
const title = document.querySelector("#title");
const priority = document.querySelector("#priority");
const error = document.querySelector("#error");
let categories = [];

function showError(message = "") { error.textContent = message; }
async function loadCategories() {
  categories = await api.getCategories();
  for (const item of categories) {
    const option = document.createElement("option");
    option.value = item.id; option.textContent = item.name;
    category.append(option);
  }
}
async function loadTasks() {
  status.textContent = "Загрузка…";
  showError();
  try {
    const filters = { q: search.value.trim(), completed: filter.value };
    const tasks = await api.getTasks(filters);
    list.replaceChildren();
    for (const task of tasks) {
      const li = document.createElement("li");
      const text = document.createElement("span");
      const cat = categories.find(item => item.id === task.categoryId)?.name || "Без категории";
      text.textContent = `#${task.id} — ${task.title} (${cat}; ${task.priority}; ${task.completed ? "выполнена" : "в работе"})`;
      const toggle = document.createElement("button");
      toggle.type = "button"; toggle.textContent = task.completed ? "Вернуть в работу" : "Выполнить";
      toggle.addEventListener("click", async () => {
        try { await api.updateTask(task.id, { completed: !task.completed }); await loadTasks(); }
        catch (e) { showError(e.message); }
      });
      const remove = document.createElement("button");
      remove.type = "button"; remove.textContent = "Удалить";
      remove.addEventListener("click", async () => {
        try { await api.deleteTask(task.id); await loadTasks(); }
        catch (e) { showError(e.message); }
      });
      li.append(text, toggle, remove); list.append(li);
    }
    status.textContent = `Задач: ${tasks.length}`;
    if (!tasks.length) status.textContent = "Задач не найдено.";
  } catch (e) {
    status.textContent = "Не удалось загрузить задачи.";
    showError(e.message);
  }
}
form.addEventListener("submit", async event => {
  event.preventDefault();
  showError();
  try {
    await api.createTask({ title: title.value, priority: priority.value, categoryId: Number(category.value) });
    form.reset(); priority.value = "medium"; await loadTasks();
  } catch (e) { showError(e.message); }
});
search.addEventListener("input", loadTasks);
filter.addEventListener("change", loadTasks);
try { await loadCategories(); await loadTasks(); }
catch (e) { status.textContent = "Ошибка запуска."; showError(e.message); }
