import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import AuthService from "@/modules/auth-service";

export const config = {
  api: {
    bodyParser: true,
  },
};

const prisma = new PrismaClient();

export async function POST(request) {
  const { payload } = await request.json();

  try {
    const userInfo = await prisma.usuarios.findFirst({
      where: {
        id: payload.id,
      },
    });

    if (!userInfo) {
      await AuthService.destroySession();
      return NextResponse.json({
        message: "Usuário não encontrado",
        status: 404,
      });
    }

    if (
      userInfo.nome === payload.nome &&
      userInfo.cpf === payload.cpf &&
      userInfo.email === payload.email &&
      userInfo.ativo === payload.ativo &&
      userInfo.admin === payload.admin
    ) {
      return NextResponse.json({
        message: "Usuário não alterado",
        status: 200,
      });
    }

    await AuthService.destroySession();
    return NextResponse.json({
      message: "Dados inconsistentes, realize o login novamente",
      status: 401,
    });
  } catch (error) {
    return NextResponse.json({
      message: "Erro ao buscar usuário",
      status: 500,
      error: error,
    });
  }
}
