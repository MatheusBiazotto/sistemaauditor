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
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
  getKeyValue,
} from "@nextui-org/react";
import { FaToiletPaper } from "react-icons/fa6";
import { FaFilePdf } from "react-icons/fa6";
import PdfCliente from "@/components/pdfCliente/pdf";
import { pdf } from "@react-pdf/renderer";
import axios from "axios";

export default function FormCliente({ userData }) {
  const [isFormCliente, setIsFormCliente] = useState(true);
  const [isFormProduct, setIsFormProduct] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const modal2 = useDisclosure();

  const [productSelectedKey, setProductSelectedKey] = useState(0);

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

  const columns = [
    {
      key: "key",
      label: "ID",
    },
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

  function openFormPapelToalha() {
    setIsFormPapelToalha(true);
    setIsFormPapelHigienico(false);
    setIsFormBobina(false);
  }

  function openFormPapelHigienico() {
    setIsFormPapelToalha(false);
    setIsFormPapelHigienico(true);
    setIsFormBobina(false);
  }

  function openFormBobina() {
    setIsFormPapelToalha(false);
    setIsFormPapelHigienico(false);
    setIsFormBobina(true);
  }

  function closeForm() {
    setIsFormPapelToalha(false);
    setIsFormPapelHigienico(false);
    setIsFormBobina(false);
  }

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

  function generateModalEditLayout() {
    const selectedProduct = rows.find(
      (row) => row.key === Number(productSelectedKey)
    );

    if (selectedProduct.tipoProduto === "Bobina de Papel Toalha") {
      return (
        <div className="flex flex-col gap-4 justify-center">
          <Input
            type="text"
            onChange={handleMarcaProduto}
            label="Marca do Produto"
            placeholder={selectedProduct.marcaProduto}
          />
          <Input
            type="number"
            onChange={handleQtdFolhasRolos}
            label="Quantidade de Folhas (padrão é 1000)"
            placeholder={selectedProduct.qtdFolhasRolos}
          />
          <Input
            type="number"
            onChange={handleQtdFardos}
            label="Quantidade de Fardos entregue/comprado"
            placeholder={selectedProduct.qtdFardos}
          />
          <h2 className="text-center text-black text-lg font-bold">
            Metragens
          </h2>
          <Input
            type="number"
            onChange={handleDiametroBobina}
            label="Diâmetro da bobina"
            placeholder={selectedProduct.metragens.diametroBobina}
          />
          <Input
            type="number"
            onChange={handleMedidaBobina}
            label="Medida da quantidade de papel na Bobina"
            placeholder={selectedProduct.metragens.medidaBobina}
          />
          <Input
            type="number"
            onChange={handleLarguraBobina}
            label="Largura da Bobina"
            placeholder={selectedProduct.metragens.larguraBobina}
          />

          <Select
            onChange={handleTipoFolha}
            label="Folha simples ou dupla"
            className="w-full text-black"
            placeholder={selectedProduct.metragens.tipoFolha}
          >
            {itemSelect.map((item) => (
              <SelectItem className="text-black" key={item} value={item}>
                {item}
              </SelectItem>
            ))}
          </Select>
        </div>
      );
    } else {
      return (
        <div className="flex flex-col gap-4 justify-center">
          <Input
            onChange={handleMarcaProduto}
            type="text"
            label="Marca do Produto"
            placeholder={selectedProduct.marcaProduto}
          />
          <Input
            type="number"
            onChange={handleQtdFolhasRolos}
            label="Quantidade de Folhas (padrão é 1000)"
            placeholder={selectedProduct.qtdFolhasRolos}
          />
          <Input
            type="number"
            onChange={handleQtdFardos}
            label="Quantidade de Fardos entregue/comprado"
            placeholder={selectedProduct.qtdFardos}
          />
        </div>
      );
    }
  }

  function editProduct() {
    const rowsAntiga = JSON.parse(JSON.stringify(rows));
    const selectedProduct = rowsAntiga.find(
      (row) => row.key === Number(productSelectedKey)
    );

    if (selectedProduct.tipoProduto === "Bobina de Papel Toalha") {
      if (marcaProduto !== "") selectedProduct.marcaProduto = marcaProduto;
      if (qtdFolhasRolos !== 0) selectedProduct.qtdFolhasRolos = qtdFolhasRolos;
      if (qtdFardos !== 0) selectedProduct.qtdFardos = qtdFardos;
      if (diametroBobina !== 0)
        selectedProduct.metragens.diametroBobina = diametroBobina;
      if (medidaBobina !== 0)
        selectedProduct.metragens.medidaBobina = medidaBobina;
      if (larguraBobina !== 0)
        selectedProduct.metragens.larguraBobina = larguraBobina;
      if (tipoFolha !== "") selectedProduct.metragens.tipoFolha = tipoFolha;
    } else {
      if (marcaProduto !== "") selectedProduct.marcaProduto = marcaProduto;
      if (qtdFolhasRolos !== 0) selectedProduct.qtdFolhasRolos = qtdFolhasRolos;
      if (qtdFardos !== 0) selectedProduct.qtdFardos = qtdFardos;
    }

    setRows(rowsAntiga);
    setMarcaProduto("");
    setQtdFolhasRolos(0);
    setQtdFardos(0);
    setDiametroBobina(0);
    setMedidaBobina(0);
    setLarguraBobina(0);
    setTipoFolha("");

    toast.success(
      `Produto com ID "${productSelectedKey}" editado com sucesso!`,
      {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
      }
    );
  }

  function saveProduct(e) {
    if (!marcaProduto || !qtdFolhasRolos || !qtdFardos) {
      toast.warning("Preencha todos os campos para salvar o produto.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
      });
      return;
    }

    if (
      e.target.name === "bobinaPapel" &&
      (!diametroBobina || !medidaBobina || !larguraBobina || !tipoFolha)
    ) {
      toast.warning("Preencha todos os campos para salvar o produto.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
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
      autoClose: 5000,
    });
  }

  function deleteProduct() {
    const rowsAntiga = JSON.parse(JSON.stringify(rows));
    const selectedProduct = rowsAntiga.find(
      (row) => row.key === Number(productSelectedKey)
    );

    const index = rowsAntiga.indexOf(selectedProduct);
    rowsAntiga.splice(index, 1);

    setRows(rowsAntiga);

    toast.success(
      `Produto com ID "${productSelectedKey}" apagado com sucesso!`,
      {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
      }
    );
  }

  async function generatePDF() {
    if (!cnpj || !nomeFantasia || !email || !nomeCliente) {
      toast.warning("Preencha todos os campos para gerar o relatório.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
      });
      return;
    }
    if (rows.length === 0) {
      toast.warning("Adicione pelo menos um produto para gerar o relatório.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
      });
      return;
    }

    toast.loading("Gerando relatório...", {
      position: "bottom-right",
      theme: "dark",
      autoClose: 5000,
    });

    const dados = {
      nomeFantasia: nomeFantasia,
      cnpj: cnpj,
      email: email,
      nomeCliente: nomeCliente,
      data: new Date().toLocaleDateString(),
      produtos: rows,
      consultor: userData.nome,
      userId: userData.id,
    };

    const retornoAPI = await axios.post("/api/pdf/savePDF", { payload: dados });

    if (retornoAPI.data.status === 200) {
      const blob = await pdf(<PdfCliente dados={dados} />).toBlob();

      toast.dismiss();

      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } else {
      toast.dismiss();
      toast.error("Erro ao gerar o relatório. Tente novamente mais tarde.", {
        position: "bottom-right",
        theme: "dark",
        autoClose: 5000,
      });
    }
  }

  function clearData() {
    setCnpj("");
    setNomeFantasia("");
    setEmail("");
    setNomeCliente("");
    setMarcaProduto("");
    setQtdFolhasRolos(0);
    setQtdFardos(0);
    setDiametroBobina(0);
    setMedidaBobina(0);
    setLarguraBobina(0);
    setTipoFolha("");
    setRows([]);

    toast.success("Dados limpos com sucesso!", {
      position: "bottom-right",
      theme: "dark",
      autoClose: 5000,
    });
  }

  return (
    <div className="flex flex-col w-full items-center justify-center">
      <form className="flex flex-col items-center justify-center flex-wrap gap-4 w-full lg:w-auto p-4">
        {isFormCliente && !isFormProduct ? (
          <>
            <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-black">
                      Editar Produto
                    </ModalHeader>
                    <ModalBody className="text-black">
                      {generateModalEditLayout()}
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          editProduct();
                          onClose();
                        }}
                      >
                        Salvar
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
            <Modal
              backdrop="blur"
              isOpen={modal2.isOpen}
              onOpenChange={modal2.onOpenChange}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col gap-1 text-black">
                      Apagar Produto
                    </ModalHeader>
                    <ModalBody className="text-black">
                      <span className="text-justify">
                        Tem certeza que deseja apagar o produto com ID "
                        {productSelectedKey}"? Essa ação não pode ser desfeita.
                      </span>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cancelar
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => {
                          deleteProduct();
                          onClose();
                        }}
                      >
                        Apagar
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
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
                  Produtos auditados
                </h1>
                <Table
                  isHeaderSticky
                  classNames={{
                    base: "max-h-[350px] overflow-auto",
                    table: "max-h-[400px]",
                  }}
                  color="primary"
                  isStriped
                  onRowAction={async (key) => {
                    await setProductSelectedKey(key);
                  }}
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
                                    <span
                                      onClick={onOpen}
                                      className="text-lg text-primary-500 cursor-pointer active:opacity-50"
                                    >
                                      <FaRegEdit />
                                    </span>
                                  </Tooltip>
                                  <Tooltip
                                    color="danger"
                                    className="text-white"
                                    content="Apagar"
                                  >
                                    <span
                                      onClick={modal2.onOpen}
                                      className="text-lg text-danger cursor-pointer active:opacity-50"
                                    >
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
              <Button
                onClick={generatePDF}
                className="w-full text-white bg-emerald-500"
              >
                <FaFilePdf size={24} />
                Gerar Relatório
              </Button>
              <Button onClick={clearData} color="danger" className="w-full">
                <FaTrash size={24} />
                Limpar Dados
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
              <Button onClick={openFormPapelToalha} color="primary">
                Papel Toalha Interfolhado
              </Button>
              <Button onClick={openFormPapelHigienico} color="primary">
                Papel Higiênico Rolão
              </Button>
              <Button onClick={openFormBobina} color="primary">
                Bobina de Papel Toalha
              </Button>

              {isFormPapelToalha ? (
                <>
                  <Input
                    onChange={handleMarcaProduto}
                    type="text"
                    label="Marca do produto"
                  />
                  <Input
                    onChange={handleQtdFolhasRolos}
                    type="text"
                    className="w-full"
                    label="Quantidade de folhas (padrão é 1000)"
                  />
                  <Input
                    onChange={handleQtdFardos}
                    type="text"
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
                      name="papelToalha"
                      onClick={saveProduct}
                      className="w-full"
                      color="primary"
                    >
                      Salvar
                    </Button>
                  </div>
                </>
              ) : isFormPapelHigienico ? (
                <>
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
                </>
              ) : isFormBobina ? (
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
              ) : null}
            </div>
          </>
        )}
      </form>
      <ToastContainer autoClose={5000} />
    </div>
  );
}
