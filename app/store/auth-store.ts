"use client";

import { create } from "zustand";
import mutations from "../graphql/mutations.graphql";
import queries from "../graphql/querys.graphql";
import { graphqlRequest } from "../graphql/client";
import { SignInResponse, User } from "../types/backend";

type SignInInput = {
  email: string;
  password: string;
};

type AuthTokens = {
  access_token: string;
  refresh_token: string;
  session_uuid?: string;
};

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  sessionUuid?: string;
  currentUser?: User;
  loading: boolean;
  error?: string;
  signIn: (input: SignInInput) => Promise<void>;
  getMe: () => Promise<User | undefined>;
  logout: () => Promise<void>;
  setTokens: (tokens: AuthTokens) => void;
};

const setCookie = (name: string, value: string, days: number) => {
  if (typeof document === "undefined") return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; sameSite=Lax`;
};

const clearSessionCookies = async () => {
  try {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.warn("No se pudo limpiar la sesion en el servidor", error);
  }

  if (typeof document !== "undefined") {
    document.cookie = "access_token=; path=/; max-age=0";
    document.cookie = "refresh_token=; path=/; max-age=0";
  }
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: undefined,
  refreshToken: undefined,
  sessionUuid: undefined,
  currentUser: undefined,
  loading: false,
  error: undefined,
  setTokens: (tokens) => {
    set({
      accessToken: tokens.access_token,
      refreshToken: tokens.refresh_token,
      sessionUuid: tokens.session_uuid,
    });
    setCookie("access_token", tokens.access_token, 1);
    setCookie("refresh_token", tokens.refresh_token, 7);
  },
  signIn: async (input) => {
    set({ loading: true, error: undefined });
    try {
      const data = await graphqlRequest<{ signIn: SignInResponse }>({
        document: mutations,
        operationName: "SignIn",
        variables: { input },
      });

      set({
        accessToken: data.signIn.access_token,
        refreshToken: data.signIn.refresh_token,
        sessionUuid: data.signIn.session_uuid,
        loading: false,
      });

      setCookie("access_token", data.signIn.access_token, 1);
      setCookie("refresh_token", data.signIn.refresh_token, 7);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo iniciar sesión";
      set({ error: message, loading: false });
      throw error;
    }
  },
  getMe: async () => {
    try {
      const data = await graphqlRequest<{ getMe: User | null }>({
        document: queries,
        operationName: "GetMe",
      });
      console.log("data", data?.getMe);
      const user = data.getMe ?? undefined;
      set({ currentUser: user });
      return user;
    } catch (error) {
      set({ currentUser: undefined });
      throw error;
    }
  },
  logout: async () => {
    await clearSessionCookies();
    set({
      accessToken: undefined,
      refreshToken: undefined,
      sessionUuid: undefined,
      currentUser: undefined,
      loading: false,
      error: undefined,
    });
  },
}));
