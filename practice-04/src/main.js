import { initialTasks } from "./data.js";
import { addTask, updateTask, toggleTask, deleteTask, getVisibleTasks } from "./task-service.js";
import { loadTasks, saveTasks, removeSavedTasks } from "./task-storage.js";

const params = new URLSearchParams(location.search);
const dataset = params.get("dataset") === "variant" ? "variant" : "demo";
const storageKey = `tip-js-practice-04:${dataset}`;
const fallback = dataset === "variant"
  ? [{ id: 21, title: "Изучить формы", completed: false, priority: "medium" }, { id: 22, title: "Проверить localStorage", completed: true, priority: "high" }]
  : initialTasks;
const loaded = loadTasks(localStorage, storageKey, fallback);
let tasks = loaded.tasks;
let filter = "all";
let editingId = null;

const form = document.querySelector("#task-form");
const idInput = document.querySelector("#task-id");
const titleInput = document.querySelector("#task-title");
const priorityInput = document.querySelector("#task-priority");
const error = document.querySelector("#form-error");
const list = document.querySelector("#task-list");
const message = document.querySelector("#message");
const labels = { low: "Низкий", medium: "Средний", high: "Высокий" };

function persist() {
  const result = saveTasks(localStorage, storageKey, tasks);
  message.textContent = result.ok ? "Изменения сохранены в браузере." : `Не удалось сохранить: ${result.error}`;
}
function render() {
  const visible = getVisibleTasks(tasks, filter);
  list.replaceChildren();
  for (const task of visible) {
    const li = document.createElement("li");
    li.className = `task-card${task.completed ? " done" : ""}`;
    li.dataset.id = String(task.id);
    const h = document.createElement("h3");
    h.className = "task-title";
    h.textContent = task.title;
    const meta = document.createElement("span");
    meta.textContent = `ID: ${task.id} · ${task.completed ? "Выполнена" : "В работе"} · Приоритет: ${labels[task.priority]}`;
    const actions = document.createElement("div");
    actions.className = "actions";
    for (const [action, text] of [["toggle", task.completed ? "Вернуть в работу" : "Выполнить"], ["edit", "Редактировать"], ["delete", "Удалить"]]) {
      const button = document.createElement("button");
      button.type = "button"; button.dataset.action = action; button.textContent = text;
      actions.append(button);
    }
    li.append(h, meta, actions); list.append(li);
  }
  document.querySelector("#total").textContent = tasks.length;
  document.querySelector("#completed").textContent = tasks.filter(t => t.completed).length;
  document.querySelector("#pending").textContent = tasks.filter(t => !t.completed).length;
  document.querySelector("#empty").hidden = visible.length !== 0;
  document.querySelector("#form-heading").textContent = editingId === null ? "Добавить задачу" : `Редактировать задачу ${editingId}`;
  idInput.disabled = editingId !== null;
  document.querySelectorAll("[data-filter]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
}
function resetForm() {
  editingId = null; form.reset(); idInput.value = String(Math.max(0, ...tasks.map(t => t.id)) + 1);
  priorityInput.value = "medium"; error.textContent = ""; render();
}
form.addEventListener("submit", event => {
  event.preventDefault();
  const draft = { id: idInput.value, title: titleInput.value, priority: priorityInput.value };
  let result;
  if (editingId === null) result = addTask(tasks, draft);
  else result = updateTask(tasks, editingId, draft.title, draft.priority);
  if (!result.ok) { error.textContent = result.error; return; }
  tasks = result.tasks; resetForm(); persist(); render();
});
document.querySelector("#cancel-edit").addEventListener("click", resetForm);
list.addEventListener("click", event => {
  const button = event.target.closest("button[data-action]");
  if (!button) return;
  const id = Number(button.closest("[data-id]").dataset.id);
  if (button.dataset.action === "edit") {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    editingId = id; idInput.value = id; titleInput.value = task.title; priorityInput.value = task.priority;
    error.textContent = ""; render(); titleInput.focus(); return;
  }
  const result = button.dataset.action === "toggle" ? toggleTask(tasks, id) : deleteTask(tasks, id);
  if (!result.ok) { message.textContent = result.error; return; }
  tasks = result.tasks;
  if (editingId === id) resetForm();
  persist(); render();
});
document.querySelector("#filters").addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (button) { filter = button.dataset.filter; render(); }
});
document.querySelector("#reset").addEventListener("click", () => {
  const result = removeSavedTasks(localStorage, storageKey);
  tasks = fallback.map(t => ({ ...t })); resetForm();
  message.textContent = result.ok ? "Данные сброшены к исходному набору." : result.error;
  render();
});
if (!loaded.ok) message.textContent = `Сохранённые данные не прочитаны: ${loaded.error}`;
resetForm(); render();
