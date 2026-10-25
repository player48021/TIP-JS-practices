export class ApiError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function createApiClient(baseUrl = "http://127.0.0.1:5507/api") {
  async function request(path, { method = "GET", body } = {}) {
    let response;
    try {
      response = await fetch(new URL(path.replace(/^\//, ""), baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`), {
        method,
        headers: { Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
        ...(body === undefined ? {} : { body: JSON.stringify(body) })
      });
    } catch {
      throw new ApiError("Не удалось подключиться к API. Проверьте, запущен ли сервер.");
    }
    let payload = null;
    if (response.status !== 204) {
      try { payload = await response.json(); }
      catch { throw new ApiError("Сервер вернул некорректный JSON.", response.status); }
    }
    if (!response.ok) throw new ApiError(payload?.error?.message || `HTTP ${response.status}`, response.status);
    return payload?.data ?? payload;
  }
  return {
    getTasks: filters => request(`tasks?${new URLSearchParams(Object.entries(filters || {}).filter(([, v]) => v !== "" && v !== undefined && v !== null))}`),
    getCategories: () => request("categories"),
    createTask: draft => request("tasks", { method: "POST", body: draft }),
    updateTask: (id, patch) => request(`tasks/${id}`, { method: "PATCH", body: patch }),
    deleteTask: id => request(`tasks/${id}`, { method: "DELETE" })
  };
}
