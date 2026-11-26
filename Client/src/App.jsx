
import { useState, useEffect } from "react";
import Item from "./Item.jsx";

function App() {
  const [filter, setFilter] = useState("Todos");
  const [search, setSearch] = useState("");
  const [randomHero, setRandomHero] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [herois, setHerois] = useState([]);
  const [load, isLoading] = useState(false);
  const [server, serverUP] = useState(true);

  useEffect(() => {
    isLoading(true);
    serverUP(true);

    fetch("http://localhost:3000/api/herois")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setHerois(data);
      })
      .catch((error) => {
        console.error(error);
        serverUP(false);
      })
      .finally(() => {
        isLoading(false);
      });
  }, []);

  let visible = herois
    .filter((heroi) => filter === "Todos" || heroi.type === filter)
    .filter((heroi) =>
      (heroi.name || "").toLowerCase().includes(search.toLowerCase())
    );

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  async function pickRandom() {
    try {
      const res = await fetch(
        "http://localhost:3000/api/herois/aleatorio"
      );

      if (!res.ok) {
        throw new Error(`Erro HTTP: ${res.status}`);
      }

      const data = await res.json();
      setRandomHero(data);
    } catch (error) {
      console.log("Erro a buscar o herói", error);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const heroiNovo = {
      name: form.elements.nome.value,
      type: form.elements.type.value,
      attack: Number(form.elements.attack.value),
      defense: Number(form.elements.defense.value)
    };

    try {
      const res = await fetch("http://localhost:3000/api/herois", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(heroiNovo)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(JSON.stringify(data));
      }

      setHerois((prevHerois) => [...prevHerois, data]);

      form.reset();

      alert("Herói guardado com sucesso!");
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao guardar: " + error.message);
    }
  }

  return (
    <>
      {load ? (
        <p>A carregar...</p>
      ) : !server ? (
        <main>
          <h1>Erro ao carregar</h1>
          <p>Não foi possível aceder à API.</p>
        </main>
      ) : (
        <main>
          <h1>Overwatch Heroes</h1>

          <p>
            Tenho {herois.length} heróis · a mostrar {visible.length}
          </p>

          <div>
            <button onClick={() => setFilter("Todos")}>
              Todos
            </button>

            <button onClick={() => setFilter("Dano")}>
              Dano
            </button>

            <button onClick={() => setFilter("Tanque")}>
              Tanque
            </button>

            <button onClick={() => setFilter("Suporte")}>
              Suporte
            </button>

            <button onClick={() => setSorted(!sorted)}>
              {sorted ? "Ordem original" : "Ordenar por ataque"}
            </button>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar herói..."
          />

          {visible.length === 0 ? (
            <p>Nenhum herói encontrado.</p>
          ) : (
            <ul>
              {visible.map((heroi) => (
                <Item
                  key={heroi.id}
                  {...heroi}
                />
              ))}
            </ul>
          )}

          <h2>Herói aleatório</h2>

          <button onClick={pickRandom}>
            Escolher outro
          </button>

          {randomHero && (
            <p>
              <b>{randomHero.name}</b> — {randomHero.type} ·
              ataque {randomHero.attack} · defesa {randomHero.defense}
            </p>
          )}

          <h2>Adicionar herói</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="nome"
              placeholder="Nome do herói"
              required
            />

            <select name="type" required>
              <option value="Dano">Dano</option>
              <option value="Tanque">Tanque</option>
              <option value="Suporte">Suporte</option>
            </select>

            <input
              type="number"
              name="attack"
              placeholder="Ataque"
              min="0"
              required
            />

            <input
              type="number"
              name="defense"
              placeholder="Defesa"
              min="0"
              required
            />

            <button type="submit">
              Guardar herói
            </button>
          </form>
        </main>
      )}
    </>
  );
}

export default App;
