import { NextResponse } from "next/server";

const COOKIE_NAMES = ["access_token", "refresh_token", "session_id"];

const clearCookiesResponse = () => {
  const response = new NextResponse(null, { status: 204 });

  COOKIE_NAMES.forEach((name) => {
    response.cookies.set({
      name,
      value: "",
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });
  });

  return response;
};

export async function POST() {
  return clearCookiesResponse();
}

export const GET = POST;
