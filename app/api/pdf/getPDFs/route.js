import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const config = {
  api: {
    bodyParser: true,
  },
};

const prisma = new PrismaClient();

export async function GET(request) {
  const pdfs = await prisma.infoPdf.findMany();

  return NextResponse.json({
    status: 200,
    pdfsInfo: pdfs,
  });
}
