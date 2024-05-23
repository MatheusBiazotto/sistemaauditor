"use server";

import Button from "./page";
import axios from "axios";

export default async function layoutButton() {
  const obj = {
    name: "Matheus",
    password: "teste",
  };

  const dados = await axios.post("http://localhost:3000/api/auth", obj);
  console.log(dados);

  return (
    <div>
      <Button dados={dados.data} />
    </div>
  );
}
