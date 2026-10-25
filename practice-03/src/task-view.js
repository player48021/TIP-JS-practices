const priorityLabels = { low: "Низкий", medium: "Средний", high: "Высокий" };

export function createTaskElement(task) {
  const item = document.createElement("li");
  item.className = task.completed ? "task-card is-completed" : "task-card";
  item.dataset.taskId = String(task.id);

  const title = document.createElement("h3");
  title.className = "task-title";
  title.textContent = task.title;

  const status = document.createElement("p");
  status.className = "task-status";
  status.textContent = task.completed ? "Выполнена" : "В работе";

  const priority = document.createElement("p");
  priority.className = "task-priority";
  priority.textContent = `Приоритет: ${priorityLabels[task.priority]}`;

  const actions = document.createElement("div");
  actions.className = "task-actions";

  const toggleButton = document.createElement("button");
  toggleButton.type = "button";
  toggleButton.dataset.action = "toggle";
  toggleButton.setAttribute("aria-pressed", String(task.completed));
  toggleButton.textContent = task.completed ? "Вернуть в работу" : "Отметить выполненной";

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Удалить";

  actions.append(toggleButton, deleteButton);
  item.append(title, status, priority, actions);
  return item;
}

export function renderTaskList(listElement, tasks) {
  const fragment = document.createDocumentFragment();
  for (const task of tasks) fragment.append(createTaskElement(task));
  listElement.replaceChildren(fragment);
}

export function renderSummary(summaryElement, tasks, visibleCount) {
  const completed = tasks.filter((task) => task.completed).length;
  summaryElement.querySelector("#total-count").textContent = String(tasks.length);
  summaryElement.querySelector("#completed-count").textContent = String(completed);
  summaryElement.querySelector("#pending-count").textContent = String(tasks.length - completed);
  summaryElement.querySelector("#progress-value").textContent =
    `${(tasks.length ? completed / tasks.length * 100 : 0).toFixed(1)}%`;
}

export function renderEmptyState(messageElement, total, visibleCount) {
  messageElement.hidden = visibleCount !== 0;
  messageElement.textContent = total === 0
    ? "Список пока пуст. Добавьте первую задачу."
    : "Задач в этом разделе нет.";
}
