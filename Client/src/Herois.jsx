
function Herois({ id, name, type, attack, defense, onDelete }) {
  return (
    <li>
      <b>{name}</b> — {type}, ataque: {attack}
      {attack >= 6 && <span className="strong"> forte</span>},
      defesa: {defense}

      <button onClick={() => onDelete(id)}>
        Apagar
      </button>
    </li>
  );
}

export default Herois;
