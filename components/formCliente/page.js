"use client";

import { useState } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Select, SelectItem } from "@nextui-org/react";

export default function FormCliente() {
  const [isFormCliente, setIsFormCliente] = useState(true);
  const [isFormProduct, setIsForProduct] = useState(false);
  let isMobile = false;
  // função pra verificar se é mobile
  if (typeof window !== "undefined") {
    isMobile = window.matchMedia("(max-width: 768px)").matches;
  }
  console.log(isMobile);

  const itemSelect = ["Folha simples", "Folha dupla"];

  function nextForm() {
    setIsFormCliente(false);
    setIsForProduct(true);
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <form className="flex items-center justify-center flex-col flex-wrap gap-4 lg:w-1/3">
        {isFormCliente && !isFormProduct ? (
          <>
            <h1 className="text-center text-2xl font-bold">Dados do Cliente</h1>
            <Input type="text" label="CNPJ" required />
            <Input type="text" label="Nome Fantasia" required />
            <Input type="email" label="Email" required />
            <Input
              type="text"
              label="Nome do Cliente que acompanhou"
              required
            />
            <Button onClick={nextForm} className="w-full" color="primary">
              Avançar
            </Button>
          </>
        ) : !isMobile ? (
          <>
            <h1 className="text-center text-2xl font-bold">
              Dados dos Produtos
            </h1>
            <h2 className="text-center text-lg font-bold">
              Selecione abaixo o produto que deseja medir
            </h2>
            <Tabs color="primary" aria-label="Options">
              <Tab
                className="w-full"
                key="photos"
                title="Papel Toalha Interfolhado"
              >
                <div className="flex items-center justify-center flex-col flex-wrap p-4 gap-4 w-full">
                  <Input type="text" label="Marca do produto" />
                  <Input
                    type="text"
                    className="w-full"
                    label="Quantidade de folhas (padrão é 1000)"
                  />
                  <Input
                    type="text"
                    label="Quantidade de fardos entregues/comprados"
                  />
                  <div className="flex gap-4">
                    <Button className="w-full" color="danger">
                      Voltar
                    </Button>
                    <Button className="w-full" color="primary">
                      Salvar
                    </Button>
                  </div>
                </div>
              </Tab>
              <Tab className="w-full" key="music" title="Papel Higiênico Rolão">
                <div className="flex items-center justify-center flex-col flex-wrap p-4 gap-4 w-full">
                  <Input type="text" label="Marca do produto" />
                  <Input
                    type="text"
                    className="w-full"
                    label="Quantidade de rolos especificada na embalagem"
                  />
                  <Input
                    type="text"
                    label="Quantidade de fardos entregue/comprado"
                  />
                  <div className="flex gap-4">
                    <Button className="w-full" color="danger">
                      Voltar
                    </Button>
                    <Button className="w-full" color="primary">
                      Salvar
                    </Button>
                  </div>
                </div>
              </Tab>
              <Tab
                className="w-full"
                key="videos"
                title="Bobina de Papel Toalha"
              >
                <div className="flex items-center justify-center flex-col flex-wrap p-4 gap-4 w-full">
                  <Input type="text" label="Marca do Produto" />
                  <Input
                    type="text"
                    className="w-full"
                    label="Quantidade de Folhas (padrão é 1000)"
                  />
                  <Input
                    type="text"
                    label="Quantidade de Fardos entregue/comprado"
                  />
                  <h2 className="text-center text-lg font-bold">Metragens</h2>
                  <Input type="number" label="Diâmetro da bobina" />
                  <Input
                    type="number"
                    label="Medida da quantidade de papel na Bobina"
                  />
                  <Input type="number" label="Largura da Bobina" />
                  <Select
                    label="Folha simples ou dupla"
                    className="w-full text-black"
                  >
                    {itemSelect.map((item) => (
                      <SelectItem
                        className="text-black"
                        key={item}
                        value={item}
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </Select>
                  <div className="flex gap-4">
                    <Button className="w-full" color="danger">
                      Voltar
                    </Button>
                    <Button className="w-full" color="primary">
                      Salvar
                    </Button>
                  </div>
                </div>
              </Tab>
            </Tabs>
          </>
        ) : (
          <div className="flex flex-col justify-center items-center gap-4">
            <Button color="primary" style={{ width: "250px" }}>
              Papel Toalha Interfolhado
            </Button>
            <Button color="primary" style={{ width: "250px" }}>
              Papel Higiênico Rolão
            </Button>
            <Button color="primary" style={{ width: "250px" }}>
              Bobina de Papel Toalha
            </Button>
          </div>
        )}
      </form>
    </div>
  );
}
