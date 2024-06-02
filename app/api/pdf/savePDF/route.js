import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const config = {
  api: {
    bodyParser: true,
  },
};

const prisma = new PrismaClient();

export async function POST(request) {
  const { payload } = await request.json();

  if (!payload) {
    return NextResponse.json({ message: "Payload incorreto!" });
  }

  if (!payload.produtos) {
    return NextResponse.json({
      message: "Payload incorreto, produtos faltantes!",
    });
  }

  if (!payload.userId) {
    return NextResponse.json({
      message: "Payload incorreto, informações do usuário faltantes!",
    });
  }

  try {
    await prisma.$connect();
    const dateFormat = new Date(payload.data);
    console.log(dateFormat);
    let uuid = await prisma.$queryRaw`SELECT gen_random_uuid()`;
    console.log(uuid);

    const infoPdf = await prisma.infoPdf.create({
      data: {
        id: uuid[0].gen_random_uuid,
        data: dateFormat,
        cnpj: payload.cnpj,
        nomeFantasia: payload.nomeFantasia,
        nomeCliente: payload.nomeCliente,
        email: payload.email,
        idUsuario: payload.userId,
      },
    });

    payload.produtos.map(async (produto) => {
      uuid = await prisma.$queryRaw`SELECT gen_random_uuid()`;
      if (produto.tipoProduto === "Bobina de Papel Toalha") {
        await prisma.produtosPdf.create({
          data: {
            id: uuid[0].gen_random_uuid,
            tipoProduto: produto.tipoProduto,
            marcaProduto: produto.marcaProduto,
            qtdTotalEmbalagem: Number(produto.qtdFolhasRolos),
            qtdCompradoMensalmente: Number(produto.qtdFardos),
            idPdf: infoPdf.id,
            diametro: Number(produto.metragens.diametroBobina),
            largura: Number(produto.metragens.larguraBobina),
            tipoPapel: produto.metragens.tipoFolha,
          },
        });
      } else {
        await prisma.produtosPdf.create({
          data: {
            id: uuid[0].gen_random_uuid,
            tipoProduto: produto.tipoProduto,
            marcaProduto: produto.marcaProduto,
            qtdTotalEmbalagem: Number(produto.qtdFolhasRolos),
            qtdCompradoMensalmente: Number(produto.qtdFardos),
            idPdf: infoPdf.id,
          },
        });
      }
    });

    return NextResponse.json({
      message: "PDF salvo com sucesso!",
      status: 200,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json({
      message: "Erro ao salvar PDF!",
      error: err,
    });
  } finally {
    await prisma.$disconnect();
  }
}
