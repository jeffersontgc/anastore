"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth-store";

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "", password: "" },
  });
  const signIn = useAuthStore((state) => state.signIn);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const [formError, setFormError] = useState<string | null>(null);

  const onSubmit = async (data: LoginForm) => {
    try {
      setFormError(null);
      await signIn(data);
      router.push("/");
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "No se pudo iniciar sesión";
      setFormError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-100 via-white to-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold text-slate-900">CrediStore</h1>
          <p className="mt-1 text-sm text-slate-600">
            Inicia sesión para acceder al panel
          </p>
        </div>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <label className="space-y-1 text-sm text-slate-700">
            <span>Email</span>
            <input
              type="email"
              {...register("email", { required: "Email requerido" })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
              placeholder="correo@dominio.com"
            />
            {errors.email ? (
              <p className="text-xs font-semibold text-rose-600">
                {errors.email.message}
              </p>
            ) : null}
          </label>
          <label className="space-y-1 text-sm text-slate-700">
            <span>Contraseña</span>
            <input
              type="password"
              {...register("password", {
                required: "Contraseña requerida",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              })}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none ring-blue-100 focus:ring"
              placeholder="••••••••"
            />
            {errors.password ? (
              <p className="text-xs font-semibold text-rose-600">
                {errors.password.message}
              </p>
            ) : null}
          </label>
          {error || formError ? (
            <p className="text-sm font-semibold text-rose-600">
              {formError || error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="mt-5 flex w-full items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {loading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
