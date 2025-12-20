import { NextRequest } from "next/server";
import { jwtVerify } from "jose";
import { MiddlewareResponse, MiddlewareStatus } from "../types/middleware";

const JWT_SECRET = process.env.JWT_SECRET ?? process.env.NEXT_PUBLIC_JWT_SECRET;

export const authenticate = async (
  request: NextRequest
): Promise<MiddlewareResponse> => {
  const token = request.cookies.get("access_token")?.value;

  if (!token) {
    return { canContinue: false, status: MiddlewareStatus.INVALID_TOKEN };
  }

  if (!JWT_SECRET) {
    // Solo permitir esto en desarrollo local estricto
    return process.env.NODE_ENV === "development"
      ? { canContinue: true }
      : { canContinue: false, status: MiddlewareStatus.INVALID_TOKEN };
  }

  try {
    await jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
    return { canContinue: true };
  } catch (error: any) {
    // jose lanza errores específicos. 'ERR_JWT_EXPIRED' es el más común.
    if (error.code === "ERR_JWT_EXPIRED") {
      return { canContinue: false, status: MiddlewareStatus.EXPIRED_TOKEN };
    }
    // Para cualquier otro error (token inválido/hackeado), denegar acceso
    return { canContinue: false, status: MiddlewareStatus.INVALID_TOKEN };
  }
};
