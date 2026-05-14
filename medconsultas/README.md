# 🏥 MedConsultas — Gestão de Saúde

Sistema de gerenciamento de consultas médicas desenvolvido em **React** com backend **Express** e persistência de dados em arquivo **JSON**.

---

## 📋 Funcionalidades

- **Cadastro e Login** de usuários com validação completa
- **Dashboard** com calendário dinâmico e resumo de consultas
- **Consultas** — criar, listar e excluir agendamentos médicos
- **Lembretes** — configurar preferências de notificação por e-mail, SMS e push
- **Dados persistidos** em `server/data/db.json` (sem banco de dados externo)
- Interface responsiva e acessível (ARIA)

---

## 🗂 Estrutura do Projeto

```
medconsultas/
├── public/
│   └── index.html              # HTML base do React
├── src/
│   ├── context/
│   │   └── AuthContext.js      # Contexto global de autenticação
│   ├── components/
│   │   ├── Header.js           # Cabeçalho e navegação
│   │   └── Header.css
│   ├── pages/
│   │   ├── Cadastro.js         # Página de cadastro
│   │   ├── Login.js            # Página de login
│   │   ├── Dashboard.js        # Painel principal
│   │   ├── Consultas.js        # Gerenciamento de consultas
│   │   ├── Lembretes.js        # Configuração de lembretes
│   │   └── *.css               # Estilos por página
│   ├── api.js                  # Funções de acesso à API
│   ├── App.js                  # Rotas da aplicação
│   ├── index.js                # Ponto de entrada React
│   └── index.css               # Estilos globais e tokens de design
├── server/
│   ├── index.js                # Servidor Express (API REST)
│   └── data/
│       └── db.json             # 📦 Banco de dados em JSON
└── package.json
```

---

## 🔄 Fluxo de Dados (JSON)

O arquivo `server/data/db.json` armazena todos os dados da aplicação no seguinte formato:

```json
{
  "usuarios": [
    {
      "id": "1715700000000",
      "email": "usuario@email.com",
      "telefone": "(11) 99999-9999",
      "senha": "minhasenha",
      "criadoEm": "2026-05-14T12:00:00.000Z"
    }
  ],
  "consultas": [
    {
      "id": "1715700001000",
      "email": "usuario@email.com",
      "nome": "Cardiologista",
      "data": "2026-06-10",
      "hora": "14:30",
      "local": "Hospital São Lucas",
      "criadaEm": "2026-05-14T12:00:00.000Z"
    }
  ],
  "lembretes": {
    "usuario@email.com": {
      "prefs": { "email": true, "sms": false, "push": true },
      "antecedencias": { "1": "1d", "2": "2h" },
      "ativos": { "1": true, "2": false },
      "atualizadoEm": "2026-05-14T12:00:00.000Z"
    }
  }
}
```

> ⚠️ **Nota de segurança**: Em produção, as senhas devem ser armazenadas com hash (ex.: `bcrypt`). Este projeto usa texto plano apenas para fins educacionais.

---

## 🚀 Passo a Passo — Subindo o Servidor Localhost

### Pré-requisitos

- **Node.js** v18 ou superior — [nodejs.org](https://nodejs.org)
- **npm** v9 ou superior (já vem com o Node)

Verifique as versões instaladas:
```bash
node -v
npm -v
```

---

### 1. Instalar as dependências

No terminal, dentro da pasta do projeto:

```bash
npm install
```

Este comando instala todas as dependências listadas no `package.json` (React, Express, etc.).

---

### 2. Rodar em modo desenvolvimento (frontend + backend juntos)

```bash
npm run dev
```

Isso inicia **dois servidores simultaneamente** usando `concurrently`:

| Serviço | URL | Descrição |
|---------|-----|-----------|
| Frontend React | http://localhost:3000 | Interface da aplicação |
| Backend Express | http://localhost:3001 | API REST + dados JSON |

Abra **http://localhost:3000** no navegador para usar o sistema.

---

### 3. Rodar apenas o backend (API)

```bash
npm run server
```

A API ficará disponível em `http://localhost:3001`.

---

### 4. Rodar apenas o frontend React

```bash
npm run client
```

O React Dev Server ficará em `http://localhost:3000`.

---

### 5. Build para produção

Gera os arquivos otimizados do frontend:

```bash
npm run build
```

Depois, inicie o servidor que servirá o build:

```bash
npm start
```

Acesse `http://localhost:3001` — o Express servirá tanto a API quanto o frontend.

---

## 🔌 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth/cadastro` | Cadastrar novo usuário |
| `POST` | `/api/auth/login` | Fazer login |
| `GET` | `/api/consultas/:email` | Listar consultas do usuário |
| `POST` | `/api/consultas` | Criar nova consulta |
| `DELETE` | `/api/consultas/:id` | Excluir consulta |
| `GET` | `/api/lembretes/:email` | Buscar preferências de lembretes |
| `PUT` | `/api/lembretes/:email` | Salvar preferências de lembretes |

---

## 🛠 Tecnologias Utilizadas

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React | 18 | Interface do usuário |
| React Router DOM | 6 | Navegação entre páginas |
| Express | 4 | Servidor e API REST |
| Node.js | 18+ | Ambiente de execução |
| concurrently | 8 | Rodar frontend e backend juntos |
| JSON (arquivo) | — | Persistência dos dados |

---

## 📝 Scripts Disponíveis

```bash
npm run dev      # Inicia frontend + backend (desenvolvimento)
npm run client   # Inicia apenas o React (porta 3000)
npm run server   # Inicia apenas o Express (porta 3001)
npm run build    # Gera build de produção do React
npm start        # Inicia Express servindo o build de produção
```

---

## 👥 Autores

Projeto acadêmico — Faculdade

© 2026 MedConsultas — Gestão de Saúde
