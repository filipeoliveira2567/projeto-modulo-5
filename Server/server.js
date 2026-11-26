
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

// Ficheiro dos heróis
const filePath = path.join(__dirname, "herois.json");
const data = JSON.parse(fs.readFileSync(filePath, "utf8"));

let herois = data.herois;

// Configurações
app.use(cors({
  origin: "http://localhost:5173"
}));

app.use(express.json());

// Guardar alterações no ficheiro JSON
function save() {
  fs.writeFileSync(
    filePath,
    JSON.stringify({ herois: herois }, null, 2),
    "utf8"
  );
}

// Página HTML
function page(title, body) {
  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
  </head>
  <body>
    <nav>
      <a href="/">Início</a> ·
      <a href="/herois">Heróis</a> ·
      <a href="/sobre">Sobre</a>
    </nav>
    <h1>${title}</h1>
    ${body}
  </body>
</html>`;
}

// Página inicial
app.get("/", (req, res) => {
  res.send(page(
    "Overwatch Heroes",
    `<p>Neste momento temos <b>${herois.length}</b> heróis na coleção.</p>`
  ));
});

// GET - Devolver todos os heróis
app.get("/api/herois", (req, res) => {
  res.json(herois);
});

// Página sobre
app.get("/sobre", (req, res) => {
  res.send(page(
    "Sobre",
    `<p>Projeto de Redes de Comunicação - Overwatch Heroes.</p>`
  ));
});

// Página com todos os heróis
app.get("/herois", (req, res) => {
  const items = herois
    .map((heroi) =>
      `<li><b>${heroi.name}</b> — ${heroi.type}, ataque ${heroi.attack}, defesa ${heroi.defense}</li>`
    )
    .join("");

  res.send(page("Heróis", `<ul>${items}</ul>`));
});

// GET - Herói aleatório
app.get("/herois/aleatorio", (req, res) => {
  const heroi = herois[Math.floor(Math.random() * herois.length)];

  res.send(page(
    "Herói aleatório",
    `<h2>${heroi.name}</h2>
     <p>${heroi.type} · ataque ${heroi.attack} · defesa ${heroi.defense}</p>`
  ));
});

// GET - API de herói aleatório
app.get("/api/herois/aleatorio", (req, res) => {
  const heroi = herois[Math.floor(Math.random() * herois.length)];
  res.json(heroi);
});

// GET - Data e hora
app.get("/agora", (req, res) => {
  const now = new Date().toLocaleString("pt-PT", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  res.send(page("Agora", `<p>Pedido respondido às <b>${now}</b>.</p>`));
});

// POST - Adicionar herói (Feature A)
app.post("/api/herois", (req, res) => {
  const heroiNovo = req.body;

  if (
    !heroiNovo.name ||
    !heroiNovo.type ||
    heroiNovo.attack === undefined ||
    heroiNovo.defense === undefined
  ) {
    return res.status(400).json({
      error: "Preenche todos os campos do herói."
    });
  }

  heroiNovo.id = herois.length > 0
    ? Math.max(...herois.map((heroi) => heroi.id)) + 1
    : 1;

  herois.push(heroiNovo);
  save();

  res.status(201).json(heroiNovo);
});

// DELETE - Apagar herói (Feature B)
app.delete("/api/herois/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = herois.findIndex((heroi) => heroi.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: "Herói não encontrado."
    });
  }

  herois.splice(index, 1);
  save();

  res.status(204).send();
});

// Rota 404
app.use((req, res) => {
  res.status(404).send(page(
    "404 — não encontrado",
    `<p>Não existe nada em <code>${req.url}</code>.</p>
     <p><a href="/">Voltar ao início</a></p>`
  ));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
