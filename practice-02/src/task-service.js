const PRIORITIES = ["low", "medium", "high"];

function failure(error) {
  return { ok: false, error };
}

function success(tasks) {
  return { ok: true, tasks };
}

export function createTask(id, title, priority = "medium") {
  if (!Number.isSafeInteger(id) || id <= 0) return failure("ID должен быть положительным целым числом.");
  if (typeof title !== "string") return failure("Название должно быть строкой.");
  const normalizedTitle = title.trim();
  if (normalizedTitle.length < 1 || normalizedTitle.length > 100) {
    return failure("Название должно содержать от 1 до 100 символов.");
  }
  if (!PRIORITIES.includes(priority)) return failure("Неизвестный приоритет.");
  return { ok: true, task: { id, title: normalizedTitle, completed: false, priority } };
}

export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function addTask(tasks, task) {
  if (!Array.isArray(tasks)) return failure("Список задач должен быть массивом.");
  if (findTaskById(tasks, task?.id)) return failure("Задача с таким ID уже существует.");
  return success([...tasks, { ...task }]);
}

export function deleteTask(tasks, id) {
  if (!findTaskById(tasks, id)) return failure("Задача не найдена.");
  return success(tasks.filter((task) => task.id !== id));
}

export function toggleTask(tasks, id) {
  if (!findTaskById(tasks, id)) return failure("Задача не найдена.");
  return success(tasks.map((task) => task.id === id
    ? { ...task, completed: !task.completed }
    : task));
}

export function getVisibleTasks(tasks, filter = "all") {
  if (filter === "all") return [...tasks];
  if (filter === "pending") return tasks.filter((task) => !task.completed);
  if (filter === "completed") return tasks.filter((task) => task.completed);
  return [];
}

export function getTaskStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  const total = tasks.length;
  return {
    total,
    completed,
    pending: total - completed,
    percentage: total === 0 ? 0 : completed / total * 100
  };
}
