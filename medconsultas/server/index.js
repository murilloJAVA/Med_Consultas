/**
 * server/index.js — Servidor Express para MedConsultas
 * Persiste todos os dados em data/db.json
 */

const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3001;
const DB_PATH = path.join(__dirname, "data", "db.json");

app.use(cors());
app.use(express.json());

// Servir build do React em produção
app.use(express.static(path.join(__dirname, "../build")));

// ── Helpers de banco JSON ──────────────────────────────────
function lerDB() {
  if (!fs.existsSync(DB_PATH)) {
    const inicial = { usuarios: [], consultas: [], lembretes: {} };
    salvarDB(inicial);
    return inicial;
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function salvarDB(dados) {
  fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
  fs.writeFileSync(DB_PATH, JSON.stringify(dados, null, 2), "utf-8");
}

// ── ROTAS: AUTENTICAÇÃO ────────────────────────────────────

// Cadastro
app.post("/api/auth/cadastro", (req, res) => {
  const { email, telefone, senha } = req.body;
  if (!email || !senha) return res.status(400).json({ erro: "Campos obrigatórios faltando." });

  const db = lerDB();
  const existe = db.usuarios.find((u) => u.email === email);
  if (existe) return res.status(409).json({ erro: "E-mail já cadastrado." });

  const usuario = {
    id: Date.now().toString(),
    email,
    telefone: telefone || "",
    senha, // Em produção: use bcrypt
    criadoEm: new Date().toISOString(),
  };

  db.usuarios.push(usuario);
  salvarDB(db);

  res.status(201).json({ mensagem: "Cadastro realizado com sucesso!", email });
});

// Login
app.post("/api/auth/login", (req, res) => {
  const { email, senha } = req.body;
  const db = lerDB();
  const usuario = db.usuarios.find((u) => u.email === email && u.senha === senha);

  if (!usuario) return res.status(401).json({ erro: "E-mail ou senha incorretos." });

  res.json({ mensagem: "Login realizado!", email: usuario.email, id: usuario.id });
});

// ── ROTAS: CONSULTAS ───────────────────────────────────────

// Listar consultas do usuário
app.get("/api/consultas/:email", (req, res) => {
  const { email } = req.params;
  const db = lerDB();
  const consultas = db.consultas
    .filter((c) => c.email === email)
    .sort((a, b) => new Date(a.data) - new Date(b.data));
  res.json(consultas);
});

// Criar consulta
app.post("/api/consultas", (req, res) => {
  const { email, nome, data, hora, local } = req.body;
  if (!email || !nome || !data || !hora)
    return res.status(400).json({ erro: "Campos obrigatórios faltando." });

  const db = lerDB();
  const consulta = {
    id: Date.now().toString(),
    email,
    nome,
    data,
    hora,
    local: local || "",
    criadaEm: new Date().toISOString(),
  };

  db.consultas.push(consulta);
  salvarDB(db);
  res.status(201).json(consulta);
});

// Excluir consulta
app.delete("/api/consultas/:id", (req, res) => {
  const { id } = req.params;
  const db = lerDB();
  const idx = db.consultas.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ erro: "Consulta não encontrada." });

  db.consultas.splice(idx, 1);
  salvarDB(db);
  res.json({ mensagem: "Consulta excluída." });
});

// ── ROTAS: LEMBRETES ───────────────────────────────────────

// Buscar preferências de lembretes
app.get("/api/lembretes/:email", (req, res) => {
  const { email } = req.params;
  const db = lerDB();
  res.json(db.lembretes[email] || {});
});

// Salvar preferências de lembretes
app.put("/api/lembretes/:email", (req, res) => {
  const { email } = req.params;
  const db = lerDB();
  db.lembretes[email] = { ...req.body, atualizadoEm: new Date().toISOString() };
  salvarDB(db);
  res.json(db.lembretes[email]);
});

// ── Fallback: React SPA ────────────────────────────────────
app.get("*", (req, res) => {
  const buildIndex = path.join(__dirname, "../build/index.html");
  if (fs.existsSync(buildIndex)) {
    res.sendFile(buildIndex);
  } else {
    res.status(404).json({ erro: "Build do React não encontrado. Rode npm run build primeiro." });
  }
});

app.listen(PORT, () => {
  console.log(`\n✅ Servidor MedConsultas rodando em http://localhost:${PORT}`);
  console.log(`📂 Dados salvos em: ${DB_PATH}\n`);
});
