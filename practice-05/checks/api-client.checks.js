import assert from "node:assert/strict";
import { buildUrl, createApiClient, ApiError } from "../src/api-client.js";
import { createTaskApi } from "../src/task-api.js";
assert.equal(buildUrl("http://localhost:5505/api/", "/tasks", { completed: false, q: "A & B" }), "http://localhost:5505/api/tasks?completed=false&q=A+%26+B");
assert.throws(() => buildUrl("/relative", "tasks"), TypeError);
const fakeResponse = (status, payload, type = "application/json") => ({
  status, ok: status >= 200 && status < 300,
  headers: { get: () => type }, json: async () => payload
});
const client = createApiClient({ baseUrl: "http://example.test/api", fetchFn: async () => fakeResponse(200, { data: [], meta: { total: 0 } }) });
const api = createTaskApi(client);
assert.deepEqual((await api.getTasks()).tasks, []);
assert.deepEqual(await api.getCategories(), []);
const badHttp = createApiClient({ fetchFn: async () => fakeResponse(404, { error: { code: "NO", message: "Not found" } }) });
await assert.rejects(() => badHttp.requestJson("/missing"), e => e instanceof ApiError && e.kind === "http" && e.status === 404);
const badType = createApiClient({ fetchFn: async () => fakeResponse(200, {}, "text/plain") });
await assert.rejects(() => badType.requestJson("/text"), e => e.kind === "invalid-response");
const network = createApiClient({ fetchFn: async () => { throw new Error("offline"); } });
await assert.rejects(() => network.requestJson("/offline"), e => e.kind === "network");
console.log("ПР5 клиент: проверки пройдены.");
