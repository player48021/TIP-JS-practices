import assert from "node:assert/strict";
const base = "http://127.0.0.1:5505/api";
try {
  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  assert.equal((await health.json()).status, "ok");
  const tasks = await (await fetch(`${base}/tasks`)).json();
  assert.ok(Array.isArray(tasks.data));
  const missing = await fetch(`${base}/tasks/999`);
  assert.equal(missing.status, 404);
  console.log("ПР5 API: проверки пройдены.");
} catch (error) {
  console.error("Не удалось проверить API. Сначала выполните npm start в другом терминале.", error.message);
  process.exitCode = 1;
}
