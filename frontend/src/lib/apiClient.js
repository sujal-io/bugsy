const DEFAULT_API_BASE_URL = "http://localhost:5000";

export function getApiBaseUrl() {
  return import.meta?.env?.VITE_API_BASE_URL || DEFAULT_API_BASE_URL;
}

export function getAuthToken() {
  return localStorage.getItem("token");
}

export class ApiError extends Error {
  constructor(message, { status, data } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export async function apiRequest(path, options = {}) {
  const url = `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers || {});
  const token = options.auth === false ? null : getAuthToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const body =
    options.body && typeof options.body === "object" && !(options.body instanceof FormData)
      ? JSON.stringify(options.body)
      : options.body;

  if (body && typeof body === "string" && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, { ...options, headers, body });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && data.message) ||
      (typeof data === "string" && data) ||
      `Request failed (${res.status})`;
    throw new ApiError(message, { status: res.status, data });
  }

  return data;
}

