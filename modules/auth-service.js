import * as jose from "jose";
import { cookies } from "next/headers";

async function openSessionToken(token) {
  //   const secret = new TextEncoder.encode(process.env.SECRET_KEY);
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const { payload } = await jose.jwtVerify(token, secret);

  return payload;
}

async function isSessionValid() {
  const sessionCookie = cookies().get("session");

  if (sessionCookie) {
    const { value } = sessionCookie;
    const { exp } = await openSessionToken(value);
    const currentDate = new Date().getTime();

    return exp * 1000 > currentDate;
  }

  return false;
}

async function createSessionToken(payload) {
  const secret = new TextEncoder().encode(process.env.SECRET_KEY);
  const session = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1d")
    .sign(secret);

  const { exp } = await openSessionToken(session);

  cookies().set("session", session, {
    expires: new Date(exp * 1000),
    path: "/",
    httpOnly: true,
  });
}

async function getPayloadCookies() {
  const sessionCookie = cookies().get("session");

  if (sessionCookie) {
    const { value } = sessionCookie;
    const payload = await openSessionToken(value);

    return payload;
  }

  return false;
}

function destroySession() {
  cookies().delete("session");
}

const AuthService = {
  openSessionToken,
  createSessionToken,
  isSessionValid,
  destroySession,
  getPayloadCookies,
};

export default AuthService;
