import { NextResponse } from "next/server";
import AuthService from "./modules/auth-service";

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};

const publicRoutes = ["/", "/admin"];
const publicResources = ["/logo-2023102012330337783.jpeg"];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const session = await AuthService.isSessionValid();
  if (publicResources.includes(pathname)) {
    return NextResponse.next();
  }

  if (publicRoutes.includes(pathname)) {
    if (session) {
      const payload = await AuthService.getPayloadCookies();
      if (payload) {
        if (payload.admin && payload.ativo) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        if (!payload.admin && payload.ativo) {
          return NextResponse.redirect(new URL("/auditoria", req.url));
        }
      }
    }
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}
