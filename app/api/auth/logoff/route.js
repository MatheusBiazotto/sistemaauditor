import { NextResponse } from "next/server";
import AuthService from "@/modules/auth-service";

export async function GET() {
  await AuthService.destroySession();
  return NextResponse.json({
    message: "Logoff deslogado com sucesso!",
    status: 200,
  });
}
