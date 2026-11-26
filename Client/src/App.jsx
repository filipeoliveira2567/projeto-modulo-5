import { useState, useEffect } from "react";
import Card from "./Card.jsx";

function App() {
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [cards, setCards] = useState([]);
  const [load, isLoading] = useState(false);
  const [server, serverUP] = useState(true);

 useEffect(() => {
    isLoading(true)
    serverUP(true);
    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Erro HTTP: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setCards(data)
      })
      .catch((error) => {
        serverUP(false);
      })
      .finally(()=> {
        isLoading(false)
      });
  }, []);

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => (card.name || "").toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  async function pickRandom()
  {
    try {
      const res = await fetch("http://localhost:3000/api/cartas/aleatoria");
      if (!res.ok) {throw new Error(`Erro HTTP: ${res.status}`);}
      const data = await res.json();
      setRandomCard(data);
    } catch
    {
      console.log("Erro a buscar a carta");
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    const cartaNova = {
      name: form.elements.nome.value,
      type: form.elements.type.value,
      attack: Number(form.elements.attack.value),
      defense: Number(form.elements.defense.value)
    };
    console.log("Dados a enviar:", cartaNova);

    try {
      const res = await fetch("http://localhost:3000/api/cartas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(cartaNova)
      });

      const data = await res.json();

      console.log("Resposta da API:", data);

      if (!res.ok) {
        throw new Error(JSON.stringify(data));
      }

      setCards((prevCards) => [...prevCards, data.carta]);

      form.reset();

      alert("Carta guardada com sucesso!");
    } catch(error) {
      console.error("Erro:", error);
      alert("Erro ao guardar: " + error.message);
    }
  }

  return (
    <>
      {load ?
        (
          <p>A carregar...</p>
        )
        : !server ?
          (
            <main>
              <h1>404 - Página não encontrada</h1>
              <p>Não foi possível aceder à API.</p>
            </main>
          )
          :
          (
            <>
              <main>
                <h1>A minha coleção</h1>
                <p>
                  Tenho {cards.length} cartas · a mostrar {visible.length}
                </p>
                <div>
                  <button onClick={() => setFilter("Todas")}>
                    Todas
                  </button>
                  <button onClick={() => setFilter("Criatura")}>
                    Só criaturas
                  </button>
                  <button onClick={() => setFilter("Feitiço")}>
                    Só feitiços
                  </button>
                  <button onClick={() => setSorted(!sorted)}>
                    {sorted ? "Ordem original" : "Ordenar por ataque"}
                  </button>
                </div>
                <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Procurar"/>
                {visible.length === 0 ? (
                  <p>Nenhuma carta corresponde.</p>
                ) : (
                  <ul>
                    {visible.map((card) => (
                      <Card key={card.name} {...card} />
                    ))}
                  </ul>
                )}
 
                <h2>Carta à sorte</h2>
 
                <button onClick={pickRandom}>
                  Escolher outra
                </button>
 
                {randomCard && (
                  <p>
                    <b>{randomCard.name}</b> — {randomCard.type} ·
                    ataque {randomCard.attack}
                  </p>
                )}

                <h2>Criar Carta</h2>

                <form onSubmit={handleSubmit}>
                  <input type="text" name="nome" id="nome" placeholder="Nome aqui" required/>
                  <select name="tipo" id="type" required>
                    <option value="Criatura">Criatura</option>
                    <option value="Feitiço">Feitiço</option>
                  </select>
                  <input type="number" name="attack" id="attack" placeholder="Ataque" required/>
                  <input type="number" name="defense" id="defense" placeholder="Defesa" required/>
                  <button type="submit">Guardar carta</button>
                </form>
              </main>
            </>
          )}
    </>
  );
}

export default App;
