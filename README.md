# projeto-modulo-5
Overwatch Heroes

Tema

Aplicação de coleção de heróis do jogo Overwatch.

Elementos do grupo

Aluno 1: [Diogo]

Aluno 2: [Filipe]

Estrutura de um herói

{
  "id": 1,
  "name": "Tracer",
  "role": "Dano",
  "health": 250
}

API

GET /api/herois

Devolve todos os heróis.

Resposta: 200 OK

Devolve uma lista de heróis em JSON.

POST /api/herois

Adiciona um novo herói.

Recebe: name, role e health.

Resposta: 201 Created.

Se os dados forem inválidos: 400 Bad Request.

DELETE /api/herois/:id

Apaga um herói através do seu ID.

Resposta: 204 No Content.

Se o herói não existir: 404 Not Found.

Tecnologias

HTML

CSS

JavaScript

React

Node.js

Express

GitHub