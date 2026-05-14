/**
 * api.js — Centralizador de chamadas ao servidor Express
 */

const BASE = "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.erro || "Erro inesperado");
  return data;
}

// Auth
export const cadastrar = (body) =>
  request("/api/auth/cadastro", { method: "POST", body: JSON.stringify(body) });

export const loginApi = (body) =>
  request("/api/auth/login", { method: "POST", body: JSON.stringify(body) });

// Consultas
export const listarConsultas = (email) => request(`/api/consultas/${encodeURIComponent(email)}`);

export const criarConsulta = (body) =>
  request("/api/consultas", { method: "POST", body: JSON.stringify(body) });

export const excluirConsulta = (id) =>
  request(`/api/consultas/${id}`, { method: "DELETE" });

// Lembretes
export const buscarLembretes = (email) => request(`/api/lembretes/${encodeURIComponent(email)}`);

export const salvarLembretes = (email, body) =>
  request(`/api/lembretes/${encodeURIComponent(email)}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
