const priorities = ["low", "medium", "high"];
export function validateTaskDraft(draft, tasks, editingId = null) {
  const errors = {};
  const id = Number(draft.id);
  const title = typeof draft.title === "string" ? draft.title.trim() : "";
  const priority = draft.priority;
  if (!Number.isSafeInteger(id) || id <= 0) errors.id = "ID должен быть положительным целым числом.";
  else if (editingId === null && tasks.some(t => t.id === id)) errors.id = "Такой ID уже существует.";
  if (!title || title.length > 100) errors.title = "Название должно содержать от 1 до 100 символов.";
  if (!priorities.includes(priority)) errors.priority = "Выберите корректный приоритет.";
  if (editingId !== null && !tasks.some(t => t.id === editingId)) errors.id = "Редактируемая задача не найдена.";
  return Object.keys(errors).length ? { ok: false, errors } : {
    ok: true, value: { id: editingId ?? id, title, priority }
  };
}
export function addTask(tasks, draft) {
  const validation = validateTaskDraft(draft, tasks);
  if (!validation.ok) return { ok: false, error: Object.values(validation.errors).join(" ") };
  return { ok: true, tasks: [...tasks, { ...validation.value, completed: false }] };
}
export function updateTask(tasks, id, title, priority) {
  const task = tasks.find(t => t.id === id);
  if (!task) return { ok: false, error: "Задача не найдена." };
  const validation = validateTaskDraft({ id, title, priority }, tasks, id);
  if (!validation.ok) return { ok: false, error: Object.values(validation.errors).join(" ") };
  return { ok: true, tasks: tasks.map(t => t.id === id ? { ...t, title: validation.value.title, priority } : t) };
}
export function toggleTask(tasks, id) {
  if (!tasks.some(t => t.id === id)) return { ok: false, error: "Задача не найдена." };
  return { ok: true, tasks: tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t) };
}
export function deleteTask(tasks, id) {
  if (!tasks.some(t => t.id === id)) return { ok: false, error: "Задача не найдена." };
  return { ok: true, tasks: tasks.filter(t => t.id !== id) };
}
export function getVisibleTasks(tasks, filter) {
  if (filter === "pending") return tasks.filter(t => !t.completed);
  if (filter === "completed") return tasks.filter(t => t.completed);
  return [...tasks];
}
