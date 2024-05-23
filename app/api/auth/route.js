import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import AuthService from "@/modules/auth-service";

export const config = {
  api: {
    bodyParser: true,
  },
};

const prisma = new PrismaClient();

export async function POST(request) {
  const { cpf, password } = await request.json();

  if (!cpf || !password) {
    return NextResponse.json({ message: "Campos faltantes" });
  }

  const user = await prisma.usuarios.findFirst({
    where: {
      cpf: cpf,
    },
  });

  if (!user) {
    return NextResponse.json({
      message: "CPF não cadastrado!",
      status: 401,
    });
  }

  const isPasswordValid = await bcrypt.compare(password, user.senha);

  if (isPasswordValid) {
    if (user.admin) {
      return NextResponse.json({
        message:
          "Usuário administrador não possui acesso ao formulário de auditoria!",
        user: user,
        status: 401,
      });
    }

    if (!user.ativo) {
      return NextResponse.json({
        message: "Usuário desativado! Entre em contato com o administrador.",
        status: 401,
      });
    }

    const payload = {
      id: user.id,
      cpf: user.cpf,
      nome: user.nome,
      ativo: user.ativo,
      admin: user.admin,
    };
    await AuthService.createSessionToken(payload);

    return NextResponse.json({
      message: "Usuário autenticado!",
      user: payload,
      status: 200,
    });
  } else {
    return NextResponse.json({
      message: "CPF ou senha inválidos!",
      status: 401,
    });
  }
}
