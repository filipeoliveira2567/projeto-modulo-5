import { useState } from "react";

function Card({ name, type, attack, defense }) {

  return (
    <li>
      <b>{name}</b> — {type}, ataque: {attack}
      {attack >= 6 && <span className="strong">forte</span>} , defesa: {defense}
    </li>
  );
}

export default Card;
