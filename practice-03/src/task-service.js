export function findTaskById(tasks, id) {
  return tasks.find((task) => task.id === id);
}

export function toggleTask(tasks, id) {
  if (!findTaskById(tasks, id)) return { ok: false, error: "Задача не найдена." };
  return {
    ok: true,
    tasks: tasks.map((task) => task.id === id
      ? { ...task, completed: !task.completed }
      : task)
  };
}

export function deleteTask(tasks, id) {
  if (!findTaskById(tasks, id)) return { ok: false, error: "Задача не найдена." };
  return { ok: true, tasks: tasks.filter((task) => task.id !== id) };
}

export function createTask(id, title, priority = "medium") {
  if (!Number.isSafeInteger(id) || id <= 0) return { ok: false, error: "Некорректный ID." };
  if (typeof title !== "string" || title.trim().length < 1 || title.trim().length > 100) {
    return { ok: false, error: "Название должно содержать от 1 до 100 символов." };
  }
  if (!["low", "medium", "high"].includes(priority)) {
    return { ok: false, error: "Некорректный приоритет." };
  }
  return {
    ok: true,
    task: { id, title: title.trim(), completed: false, priority }
  };
}

export function getTaskStats(tasks) {
  const completed = tasks.filter((task) => task.completed).length;
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed,
    percentage: tasks.length ? completed / tasks.length * 100 : 0
  };
}
