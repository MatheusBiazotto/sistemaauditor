"use server";

import FormCliente from "@/components/formCliente/page";

export default async function PageAuditoria() {
  return (
    <div className="flex flex-wrap w-full items-center justify-center min-h-screen">
      <FormCliente />
    </div>
  );
}
