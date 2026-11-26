import { useState } from "react";

function herois({ name, type, attack, defense }) {

  return (
    <li>
      <b>{name}</b> — {type}, ataque: {attack}
      {attack >= 6 && <span className="strong">forte</span>} , defesa: {defense}
    </li>
  );
}
function save() {
  fs.writeFileSync(
    filePath,
    JSON.stringify({ herois: herois }, null, 2),
    "utf8"
  );
}

export default herois;
