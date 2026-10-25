const base = process.env.API_URL || "http://127.0.0.1:5505/api";
for (const path of ["/health", "/tasks", "/tasks/999", "/categories"]) {
  try {
    const response = await fetch(`${base}${path}`);
    console.log(path, "status =", response.status, "ok =", response.ok,
      "content-type =", response.headers.get("content-type"));
    console.log(await response.json());
  } catch (error) {
    console.error(path, error.message);
  }
}
