"use server";

import FormCliente from "@/components/formCliente/page";
import AuthService from "@/modules/auth-service";

export default async function PageAuditoria() {
  const userInfo = await AuthService.getPayloadCookies();

  return (
    <div className="flex flex-wrap w-full items-center justify-center min-h-screen">
      <FormCliente userData={userInfo} />
    </div>
  );
}
