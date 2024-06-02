

import AuthService from "@/modules/auth-service";

export default async function LayoutAdmin({ children }) {
  const userInfo = await AuthService.getPayloadCookies();

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-3xl text-center">
        Olá, seja bem-vindo, {userInfo.nome}!
      </h1>
      {/* {children} */}
    </div>
  );
}
