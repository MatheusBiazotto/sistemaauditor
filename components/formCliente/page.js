"use client";

import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Select, SelectItem } from "@nextui-org/react";
import { FaTrash } from "react-icons/fa6";
import { FaRegEdit } from "react-icons/fa";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import { FaToiletPaper } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";

export default function FormCliente() {
  const [isFormCliente, setIsFormCliente] = useState(true);
  const [isFormProduct, setIsFormProduct] = useState(false);

  //Info Clientes
  const [cnpj, setCnpj] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [email, setEmail] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");

  //Info Produtos
  const [marcaProduto, setMarcaProduto] = useState("");
  const [qtdFolhasRolos, setQtdFolhasRolos] = useState(0);
  const [qtdFardos, setQtdFardos] = useState(0);

  //Metragens
  const [diametroBobina, setDiametroBobina] = useState(0);
  const [medidaBobina, setMedidaBobina] = useState(0);
  const [larguraBobina, setLarguraBobina] = useState(0);
  const [tipoFolha, setTipoFolha] = useState("");

  // para mobile
  const [isFormPapelToalha, setIsFormPapelToalha] = useState(false);
  const [isFormPapelHigienico, setIsFormPapelHigienico] = useState(false);
  const [isFormBobina, setIsFormBobina] = useState(false);
  // fim mobile

  const columns = [
    {
      key: "tipoProduto",
      label: "TIPO",
    },
    {
      key: "marcaProduto",
      label: "MARCA",
    },
    {
      key: "qtdFolhasRolos",
      label: "QTD. FOLHAS/ROLOS",
    },
    {
      key: "qtdFardos",
      label: "QTD. FARDOS ENTR.",
    },
    {
      key: "actions",
      label: "AÇÕES",
    },
  ];
  const [rows, setRows] = useState([]);

  const itemSelect = ["Folha simples", "Folha dupla"];

  const cnpjFormat = (value) => {
    value.replace(/\D/g, "");
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .replace(/(-\d{2})\d+?$/, "$1");
  };

  function nextForm() {
    setIsFormCliente(false);
    setIsFormProduct(true);
  }

  function backForm() {
    setIsFormCliente(true);
    setIsFormProduct(false);
  }

  function handleMarcaProduto(e) {
    setMarcaProduto(e.target.value);
  }

  function handleQtdFolhasRolos(e) {
    setQtdFolhasRolos(e.target.value);
  }

  function handleQtdFardos(e) {
    setQtdFardos(e.target.value);
  }

  function handleDiametroBobina(e) {
    setDiametroBobina(Number(e.target.value));
  }

  function handleMedidaBobina(e) {
    setMedidaBobina(Number(e.target.value));
  }

  function handleLarguraBobina(e) {
    setLarguraBobina(Number(e.target.value));
  }

  function handleTipoFolha(e) {
    setTipoFolha(e.target.value);
  }

  function handleCNPJChange(e) {
    setCnpj(cnpjFormat(e.target.value));
  }

  function handleNomeFantasiaChange(e) {
    setNomeFantasia(e.target.value);
  }

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handleNomeClienteChange(e) {
    setNomeCliente(e.target.value);
  }

  function saveProduct(e) {
    console.log(e.target.name);
    if (!marcaProduto || !qtdFolhasRolos || !qtdFardos) {
      toast.warning("Preencha todos os campos para salvar o produto.", {
        position: "bottom-right",
        theme: "dark",
      });
      return;
    }
    let tipoProduto = "";
    let haveMetragens = false;

    if (e.target.name === "papelHigienico") {
      tipoProduto = "Papel Higiênico Rolão";
    } else if (e.target.name === "papelToalha") {
      tipoProduto = "Papel Toalha Interfolhado";
    } else if (e.target.name === "bobinaPapel") {
      tipoProduto = "Bobina de Papel Toalha";
      haveMetragens = true;
    }

    const lastKey = rows[rows.length - 1]?.key || 0;
    const rowsAntiga = JSON.parse(JSON.stringify(rows));

    if (!haveMetragens) {
      rowsAntiga.push({
        key: lastKey + 1,
        tipoProduto: tipoProduto,
        marcaProduto: marcaProduto,
        qtdFolhasRolos: qtdFolhasRolos,
        qtdFardos: qtdFardos,
        actions: true,
      });
    } else {
      rowsAntiga.push({
        key: lastKey + 1,
        tipoProduto: tipoProduto,
        marcaProduto: marcaProduto,
        qtdFolhasRolos: qtdFolhasRolos,
        qtdFardos: qtdFardos,
        actions: true,
        metragens: {
          diametroBobina: diametroBobina,
          medidaBobina: medidaBobina,
          larguraBobina: larguraBobina,
          tipoFolha: tipoFolha,
        },
      });

      setDiametroBobina(0);
      setMedidaBobina(0);
      setLarguraBobina(0);
      setTipoFolha("");
    }

    setRows(rowsAntiga);

    setMarcaProduto("");
    setQtdFolhasRolos(0);
    setQtdFardos(0);

    setIsFormProduct(false);
    setIsFormCliente(true);

    toast.success("Produto salvo com sucesso!", {
      position: "bottom-right",
      theme: "dark",
    });
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <form className="flex flex-col items-center justify-center flex-wrap gap-4 w-full lg:w-auto p-4">
        {isFormCliente && !isFormProduct ? (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,_minmax(0,_300px))] justify-center lg:grid-cols-2 gap-4 w-full p-4">
              <div className="flex flex-col gap-4 justify-center">
                <h1 className="text-center text-white text-2xl font-bold">
                  Dados do Cliente
                </h1>
                <Input
                  onChange={handleCNPJChange}
                  value={cnpj}
                  type="text"
                  label="CNPJ"
                  isRequired
                />
                <Input
                  onChange={handleNomeFantasiaChange}
                  value={nomeFantasia}
                  type="text"
                  label="Nome Fantasia"
                  isRequired
                />
                <Input
                  onChange={handleEmailChange}
                  value={email}
                  type="email"
                  label="Email"
                  isRequired
                />
                <Input
                  onChange={handleNomeClienteChange}
                  value={nomeCliente}
                  type="text"
                  label="Nome do Cliente que acompanhou"
                  isRequired
                />
              </div>
              <div className="flex flex-col w-full items-center gap-4">
                <h1 className="text-center text-white text-2xl font-bold">
                  Produtos cadastrados
                </h1>
                <Table
                  isHeaderSticky
                  classNames={{
                    base: "max-h-[350px] overflow-auto",
                    table: "max-h-[400px]",
                  }}
                  color="primary"
                  isStriped
                  aria-label="Example table with dynamic content"
                >
                  <TableHeader columns={columns}>
                    {(column) => (
                      <TableColumn key={column.key}>{column.label}</TableColumn>
                    )}
                  </TableHeader>
                  <TableBody
                    emptyContent={"Nenhum produto adicionado."}
                    className="text-black"
                    items={rows}
                  >
                    {(item) => (
                      <TableRow key={item.key}>
                        {(columnKey) =>
                          columnKey === "actions" ? (
                            item.actions ? (
                              <TableCell className="text-black">
                                <div className="relative flex items-center gap-4">
                                  <Tooltip
                                    color="primary"
                                    className="text-white"
                                    content="Editar"
                                  >
                                    <span className="text-lg text-primary-500 cursor-pointer active:opacity-50">
                                      <FaRegEdit />
                                    </span>
                                  </Tooltip>
                                  <Tooltip
                                    color="danger"
                                    className="text-white"
                                    content="Apagar"
                                  >
                                    <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                      <FaTrash />
                                    </span>
                                  </Tooltip>
                                </div>
                              </TableCell>
                            ) : (
                              <TableCell className="text-black"></TableCell>
                            )
                          ) : (
                            <TableCell className="text-black">
                              {getKeyValue(item, columnKey)}
                            </TableCell>
                          )
                        }
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="flex gap-4 flex-wrap">
              <Button onClick={nextForm} className="w-full" color="primary">
                <FaToiletPaper size={24} />
                Cadastrar Produtos
              </Button>
              <Button className="w-full text-white bg-emerald-500">
                <FaFilePdf size={24} />
                Gerar Relatório
              </Button>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-center text-white text-2xl font-bold">
              Dados dos Produtos
            </h1>
            <h2 className="text-center text-white text-lg font-bold">
              Selecione abaixo o produto que deseja medir
            </h2>
            <Tabs
              className="hidden lg:flex"
              color="primary"
              aria-label="Options"
            >
              <Tab
                className="w-full"
                key="photos"
                title="Papel Toalha Interfolhado"
              >
                <div className="hidden lg:flex items-center justify-center flex-col flex-wrap p-4 gap-4 w-full">
                  <Input
                    onChange={handleMarcaProduto}
                    type="text"
                    label="Marca do produto"
                  />
                  <Input
                    type="number"
                    className="w-full"
                    onChange={handleQtdFolhasRolos}
                    label="Quantidade de folhas (padrão é 1000)"
                  />
                  <Input
                    type="number"
                    onChange={handleQtdFardos}
                    label="Quantidade de fardos entregues/comprados"
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={backForm}
                      className="w-full"
                      color="danger"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={saveProduct}
                      className="w-full"
                      color="primary"
                      name="papelToalha"
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </Tab>
              <Tab className="w-full" key="music" title="Papel Higiênico Rolão">
                <div className="flex items-center justify-center flex-col flex-wrap p-4 gap-4 w-full">
                  <Input
                    onChange={handleMarcaProduto}
                    name="marcaPapelHigienico"
                    type="text"
                    label="Marca do produto"
                  />
                  <Input
                    type="number"
                    onChange={handleQtdFolhasRolos}
                    name="qtdRolosPapelHigienico"
                    className="w-full"
                    label="Quantidade de rolos especificada na embalagem"
                  />
                  <Input
                    onChange={handleQtdFardos}
                    type="number"
                    name="qtdFardosPapelHigienico"
                    label="Quantidade de fardos entregue/comprado"
                  />
                  <div className="flex gap-4">
                    <Button
                      onClick={backForm}
                      className="w-full"
                      color="danger"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={saveProduct}
                      name="papelHigienico"
                      className="w-full"
                      color="primary"
                    >
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
                  <Input
                    onChange={handleMarcaProduto}
                    type="text"
                    label="Marca do Produto"
                  />
                  <Input
                    onChange={handleQtdFolhasRolos}
                    type="number"
                    className="w-full"
                    label="Quantidade de Folhas (padrão é 1000)"
                  />
                  <Input
                    type="number"
                    onChange={handleQtdFardos}
                    label="Quantidade de Fardos entregue/comprado"
                  />
                  <h2 className="text-center text-white text-lg font-bold">
                    Metragens
                  </h2>
                  <Input
                    onChange={handleDiametroBobina}
                    type="number"
                    label="Diâmetro da bobina"
                  />
                  <Input
                    onChange={handleMedidaBobina}
                    type="number"
                    label="Medida da quantidade de papel na Bobina"
                  />
                  <Input
                    onChange={handleLarguraBobina}
                    type="number"
                    label="Largura da Bobina"
                  />
                  <Select
                    onChange={handleTipoFolha}
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
                    <Button
                      onClick={backForm}
                      className="w-full"
                      color="danger"
                    >
                      Voltar
                    </Button>
                    <Button
                      onClick={saveProduct}
                      name="bobinaPapel"
                      className="w-full"
                      color="primary"
                    >
                      Salvar
                    </Button>
                  </div>
                </div>
              </Tab>
            </Tabs>

            <div className="flex flex-col w-full items-center justify-center lg:hidden gap-4">
              <Button color="primary">Papel Toalha Interfolhado</Button>
              <Button color="primary">Papel Higiênico Rolão</Button>
              <Button color="primary">Bobina de Papel Toalha</Button>

              {isFormPapelToalha ? (
                <>
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
                </>
              ) : null}
            </div>
          </>
        )}
      </form>
      <ToastContainer autoClose={5000} />
    </div>
  );
}
