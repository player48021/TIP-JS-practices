export class ApiError extends Error {
  constructor(kind, message, options = {}) {
    super(message, options.cause ? { cause: options.cause } : undefined);
    this.name = "ApiError";
    this.kind = kind;
    this.status = options.status;
    this.code = options.code;
    this.url = options.url;
  }
}
export function buildUrl(baseUrl, path, query = {}) {
  let base;
  try { base = new URL(baseUrl); } catch { throw new TypeError("baseUrl должен быть абсолютным URL."); }
  if (!["http:", "https:"].includes(base.protocol) || base.search || base.hash) throw new TypeError("Недопустимый baseUrl.");
  if (typeof path !== "string" || !path.trim()) throw new TypeError("path должен быть непустой строкой.");
  const url = new URL(path.replace(/^\/+/, ""), base.href.endsWith("/") ? base : `${base.href}/`);
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    url.searchParams.set(key, String(value));
  }
  return url.href;
}
export function createApiClient({ baseUrl = "http://127.0.0.1:5505/api", timeoutMs = 3000, fetchFn = fetch } = {}) {
  if (!Number.isFinite(timeoutMs) || timeoutMs <= 0) throw new TypeError("timeoutMs должен быть положительным числом.");
  if (typeof fetchFn !== "function") throw new TypeError("fetchFn должен быть функцией.");
  async function requestJson(path, { query = {}, signal } = {}) {
    const url = buildUrl(baseUrl, path, query);
    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, timeoutMs);
    const abort = () => controller.abort(signal?.reason);
    if (signal?.aborted) abort();
    else signal?.addEventListener("abort", abort, { once: true });
    try {
      let response;
      try { response = await fetchFn(url, { method: "GET", headers: { Accept: "application/json" }, signal: controller.signal }); }
      catch (cause) {
        const kind = timedOut ? "timeout" : signal?.aborted ? "aborted" : "network";
        throw new ApiError(kind, `Ошибка запроса (${kind}).`, { cause, url });
      }
      if (!response || typeof response.status !== "number") throw new ApiError("invalid-response", "fetch вернул неверный ответ.", { url });
      if (!response.ok) {
        let payload = null;
        try { payload = await response.json(); } catch {}
        throw new ApiError("http", payload?.error?.message || `HTTP ${response.status}`, {
          status: response.status, code: payload?.error?.code, url
        });
      }
      if (response.status === 204) return null;
      const contentType = response.headers?.get?.("content-type") || "";
      if (!contentType.toLowerCase().includes("application/json")) throw new ApiError("invalid-response", "Ожидался JSON.", { status: response.status, url });
      try { return await response.json(); }
      catch (cause) { throw new ApiError("invalid-response", "Некорректный JSON.", { cause, status: response.status, url }); }
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", abort);
    }
  }
  return { requestJson };
}
