export function isValidTaskList(value) {
  if (!Array.isArray(value)) return false;
  const ids = new Set();
  return value.every(task => {
    const valid = task && Number.isSafeInteger(task.id) && task.id > 0 &&
      typeof task.title === "string" && task.title.trim().length > 0 &&
      task.title.length <= 100 && typeof task.completed === "boolean" &&
      ["low", "medium", "high"].includes(task.priority) && !ids.has(task.id);
    if (valid) ids.add(task.id);
    return valid;
  });
}
export function loadTasks(storage, key, fallbackTasks) {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return { ok: true, source: "initial", tasks: fallbackTasks.map(t => ({ ...t })) };
    const parsed = JSON.parse(raw);
    if (parsed?.version !== 1 || !isValidTaskList(parsed.tasks)) throw new Error("Сохранённые данные имеют неверный формат.");
    return { ok: true, source: "storage", tasks: parsed.tasks.map(t => ({ ...t })) };
  } catch (error) {
    return { ok: false, source: "fallback", tasks: fallbackTasks.map(t => ({ ...t })), error: error.message };
  }
}
export function saveTasks(storage, key, tasks) {
  if (!isValidTaskList(tasks)) return { ok: false, error: "Нельзя сохранить некорректный список." };
  try {
    storage.setItem(key, JSON.stringify({ version: 1, tasks }));
    return { ok: true };
  } catch (error) { return { ok: false, error: error.message }; }
}
export function removeSavedTasks(storage, key) {
  try { storage.removeItem(key); return { ok: true }; }
  catch (error) { return { ok: false, error: error.message }; }
}
