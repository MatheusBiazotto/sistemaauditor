import { NextResponse } from "next/server";
import AuthService from "./modules/auth-service";
import axios from "axios";

export const config = {
  //'/((?!api|_next/static|_next/image|favicon.ico).*)'
  matcher: ["/((?!public|_next/static|_next/image|.*\\.png$).*)"],
};

const publicRoutes = ["/", "/api"];
const publicResources = ["/logo-2023102012330337783.jpeg", "/qrcode.png"];

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;
  const session = await AuthService.isSessionValid();
  const payload = await AuthService.getPayloadCookies();

  if (pathname.includes("/api")) {
    return NextResponse.next();
  }

  if (pathname === "/") {
    if (session) {
      if (payload) {
        const userDataIsValid = await verifyDataInDatabase(payload);
        if (!userDataIsValid) {
          return NextResponse.next();
        }
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

  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  if (publicResources.includes(pathname)) {
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.includes("/admin")) {
    if (payload) {
      const userDataIsValid = await verifyDataInDatabase(payload);
      if (!userDataIsValid) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (!payload.admin) {
        return NextResponse.redirect(new URL("/auditoria", req.url));
      }
    }
    NextResponse.redirect(new URL("/", req.url));
  }

  if (pathname.includes("/auditoria")) {
    if (payload) {
      const userDataIsValid = await verifyDataInDatabase(payload);
      if (!userDataIsValid) {
        return NextResponse.redirect(new URL("/", req.url));
      }
      if (payload.admin) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      return NextResponse.next();
    }
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

async function verifyDataInDatabase(payload) {
  const userData = await axios.post(
    `${process.env.PROJECT_URL}/api/user/validateInfos`,
    {
      payload,
    }
  );
  if (userData.data.status !== 200) {
    await axios.get(`${process.env.PROJECT_URL}/api/auth/logoff`);
    return false;
  }

  return true;
}
