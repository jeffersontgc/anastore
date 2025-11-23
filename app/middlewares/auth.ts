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

  // Si no hay secreto configurado, solo verificamos presencia de token (dev)
  if (!JWT_SECRET) {
    return { canContinue: true };
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );

    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { canContinue: false, status: MiddlewareStatus.EXPIRED_TOKEN };
    }

    return { canContinue: true };
  } catch (error) {
    // Si falla la validación pero tenemos token, en dev permitimos continuar.
    if (
      (error as { code?: string })?.code === "ERR_JWT_EXPIRED" ||
      (error as { claim?: string })?.claim === "exp"
    ) {
      return { canContinue: false, status: MiddlewareStatus.EXPIRED_TOKEN };
    }
    return { canContinue: true };
  }
};
