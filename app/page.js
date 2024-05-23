"use client";

import { Input } from "@nextui-org/react";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import { TbDoorExit } from "react-icons/tb";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const cpfMask = (value) => {
    return value
      .replace(/\D/g, "") // substitui qualquer caracter que nao seja numero por nada
      .replace(/(\d{3})(\d)/, "$1.$2") // captura 2 grupos de numero o primeiro de 3 e o segundo de 1, apos capturar o primeiro grupo ele adiciona um ponto antes do segundo grupo de numero
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1"); // captura 2 numeros seguidos de um traço e não deixa ser digitado mais nada
  };

  function handleCPFChange(e) {
    setCpf(cpfMask(e.target.value));
  }
  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  async function submitLogin() {
    const response = await axios.post("/api/auth", {
      cpf: cpf,
      password: password,
    });

    console.log(response.data);

    if (response.data.status === 200) {
      toast.success(response.data.message, {
        position: "bottom-right",
        theme: "dark",
      });

      router.push("/auditoria");
    } else {
      toast.error(response.data.message, {
        position: "bottom-right",
        theme: "dark",
      });
    }
  }

  return (
    <main className="flex overflow-y-hidden min-h-screen flex-col items-center justify-center flex-wrap">
      <form className="flex flex-col gap-4 p-4 w-96">
        <h1 className="text-center text-2xl font-bold">Área de Acesso</h1>
        <Input
          onChange={handleCPFChange}
          className="w-full"
          type="text"
          label="CPF"
          value={cpf}
        />
        <Input
          label="Senha"
          variant="flat"
          className="w-full"
          onChange={handlePasswordChange}
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <FaEyeSlash color="#000" size={24} />
              ) : (
                <FaEye color="#000" size={24} />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
        />

        <Button
          color="primary"
          onClick={submitLogin}
          disabled={!cpf || !password}
          endContent={<TbDoorExit size={20} />}
        >
          Entrar
        </Button>
      </form>

      <ToastContainer autoClose={5000} />
    </main>
  );
}
