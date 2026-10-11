import { initialTasks } from "./data.js";
import { createTask, toggleTask, deleteTask, getTaskStats } from "./task-service.js";
import { getVisibleTasks } from "./task-selectors.js";
import { renderTaskList, renderSummary, renderEmptyState } from "./task-view.js";

let currentTasks = initialTasks.map((task) => ({ ...task }));
let currentFilter = "all";
let nextId = Math.max(...currentTasks.map((task) => task.id)) + 1;

const listElement = document.querySelector("#task-list");
const form = document.querySelector("#task-form");
const titleInput = document.querySelector("#task-title");
const priorityInput = document.querySelector("#task-priority");
const summaryElement = document.querySelector(".summary");
const emptyMessage = document.querySelector("#empty-message");
const operationMessage = document.querySelector("#operation-message");
const filtersElement = document.querySelector(".filters");

function renderApp() {
  const visibleTasks = getVisibleTasks(currentTasks, currentFilter);
  renderTaskList(listElement, visibleTasks);
  renderSummary(summaryElement, currentTasks, visibleTasks.length);
  renderEmptyState(emptyMessage, currentTasks.length, visibleTasks.length);
  for (const button of filtersElement.querySelectorAll("[data-filter]")) {
    button.setAttribute("aria-pressed", String(button.dataset.filter === currentFilter));
  }
}

function handleTaskListClick(event) {
  const button = event.target.closest("button[data-action]");
  if (!button || !listElement.contains(button)) return;
  const card = button.closest("li[data-task-id]");
  if (!card) return;
  const id = Number(card.dataset.taskId);
  if (!Number.isSafeInteger(id) || id <= 0) return;

  const result = button.dataset.action === "toggle"
    ? toggleTask(currentTasks, id)
    : button.dataset.action === "delete"
      ? deleteTask(currentTasks, id)
      : null;

  if (!result) return;
  if (!result.ok) {
    operationMessage.textContent = result.error;
    return;
  }
  currentTasks = result.tasks;
  operationMessage.textContent = "";
  renderApp();
}

function handleFilterClick(event) {
  const button = event.target.closest("button[data-filter]");
  if (!button || !filtersElement.contains(button)) return;
  const filter = button.dataset.filter;
  if (!["all", "pending", "completed"].includes(filter)) return;
  currentFilter = filter;
  operationMessage.textContent = "";
  renderApp();
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const result = createTask(nextId, titleInput.value, priorityInput.value);
  if (!result.ok) {
    operationMessage.textContent = result.error;
    return;
  }
  currentTasks = [...currentTasks, result.task];
  nextId += 1;
  form.reset();
  operationMessage.textContent = "";
  renderApp();
  titleInput.focus();
});

listElement.addEventListener("click", handleTaskListClick);
filtersElement.addEventListener("click", handleFilterClick);
renderApp();
