import { getAuth } from "firebase/auth";

export async function apiFetch(path, { method = "GET", headers = {}, body } = {}) {
  const auth = getAuth();
  const current = auth.currentUser;
  const token = current ? await current.getIdToken() : null;

  const res = await fetch(path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // Manejo de errores uniforme
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  // Devuelve JSON si hay
  const contentType = res.headers.get("content-type") || "";
  return contentType.includes("application/json") ? res.json() : res.text();
}
