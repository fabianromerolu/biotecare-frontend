"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  Activity,
  LockKeyhole,
  LogIn,
  Mail,
  Microscope,
  ShieldCheck,
  Sparkles,
  UserPlus,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { getApiErrorMessage } from "@/lib/api/client";
import { registerDoctor } from "@/lib/api/auth";
import { APP_NAME } from "@/lib/constants";
import {
  LoginSchema,
  RegisterSchema,
  type LoginInput,
  type RegisterInput,
} from "@/lib/schemas/auth";
import { cn } from "@/lib/utils";

type AuthMode = "login" | "register";

const SIGNALS = [
  { label: "IVCM", value: "Confocal" },
  { label: "IA", value: "ResNet-18" },
  { label: "Flujo", value: "Clinico" },
] as const;

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loginMutation } = useAuth();
  const [mode, setMode] = useState<AuthMode>("login");
  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });
  const registerForm = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const registerMutation = useMutation({
    mutationFn: ({ full_name, email, password }: RegisterInput) =>
      registerDoctor({ full_name, email, password }),
    onSuccess: (_user, values) => {
      toast.success("Cuenta creada. Iniciando sesion.");
      loginMutation.mutate({ email: values.email, password: values.password });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/patients");
    }
  }, [isAuthenticated, router]);

  const isBusy = loginMutation.isPending || registerMutation.isPending;

  return (
    <div className="auth-stage relative isolate min-h-screen overflow-hidden px-4 py-8 text-white sm:px-6 lg:px-8">
      <TechBackdrop />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-6xl items-center gap-8 lg:grid-cols-[minmax(360px,440px)_1fr]">
        <Card
          className="w-[min(22rem,calc(100vw-2rem))] min-w-0 justify-self-center rounded-lg border-white/40 bg-white/[0.94] py-5 text-foreground shadow-2xl shadow-cyan-950/30 backdrop-blur-xl sm:w-full sm:max-w-md"
        >
          <CardHeader className="gap-4 px-5 pb-1">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Microscope className="size-6" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{APP_NAME}</CardTitle>
                <CardDescription>Acceso clinico seguro</CardDescription>
              </div>
            </div>

            <div className="grid rounded-lg border bg-muted/50 p-1 sm:grid-cols-2">
              <ModeButton active={mode === "login"} onClick={() => setMode("login")}>
                <LogIn className="size-4" aria-hidden="true" />
                Entrar
              </ModeButton>
              <ModeButton active={mode === "register"} onClick={() => setMode("register")}>
                <UserPlus className="size-4" aria-hidden="true" />
                Registrarse
              </ModeButton>
            </div>
          </CardHeader>

          <CardContent className="px-5">
            {mode === "login" ? (
              <form
                className="grid gap-4"
                onSubmit={loginForm.handleSubmit((values) => loginMutation.mutate(values))}
              >
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Correo electronico</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-2 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className="pl-9"
                      aria-invalid={Boolean(loginForm.formState.errors.email)}
                      {...loginForm.register("email")}
                    />
                  </div>
                  {loginForm.formState.errors.email ? (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="password">Contrasena</Label>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3 top-2 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password"
                      className="pl-9"
                      aria-invalid={Boolean(loginForm.formState.errors.password)}
                      {...loginForm.register("password")}
                    />
                  </div>
                  {loginForm.formState.errors.password ? (
                    <p className="text-sm text-destructive">
                      {loginForm.formState.errors.password.message}
                    </p>
                  ) : null}
                </div>

                {loginMutation.isError ? (
                  <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                    Credenciales incorrectas. Verifique su correo y contrasena.
                  </p>
                ) : null}

                <Button type="submit" disabled={isBusy} className="h-9 w-full">
                  {loginMutation.isPending ? <LockKeyhole /> : <LogIn />}
                  {loginMutation.isPending ? "Validando acceso..." : "Entrar a la plataforma"}
                </Button>
              </form>
            ) : (
              <form
                className="grid gap-4"
                onSubmit={registerForm.handleSubmit((values) =>
                  registerMutation.mutate(values),
                )}
              >
                <div className="grid gap-1.5">
                  <Label htmlFor="full_name">Nombre completo</Label>
                  <Input
                    id="full_name"
                    autoComplete="name"
                    aria-invalid={Boolean(registerForm.formState.errors.full_name)}
                    {...registerForm.register("full_name")}
                  />
                  {registerForm.formState.errors.full_name ? (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.full_name.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="register_email">Correo electronico</Label>
                  <Input
                    id="register_email"
                    type="email"
                    autoComplete="email"
                    aria-invalid={Boolean(registerForm.formState.errors.email)}
                    {...registerForm.register("email")}
                  />
                  {registerForm.formState.errors.email ? (
                    <p className="text-sm text-destructive">
                      {registerForm.formState.errors.email.message}
                    </p>
                  ) : null}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="register_password">Contrasena</Label>
                    <Input
                      id="register_password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(registerForm.formState.errors.password)}
                      {...registerForm.register("password")}
                    />
                    {registerForm.formState.errors.password ? (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.password.message}
                      </p>
                    ) : null}
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="confirm_password">Confirmar</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      autoComplete="new-password"
                      aria-invalid={Boolean(registerForm.formState.errors.confirm_password)}
                      {...registerForm.register("confirm_password")}
                    />
                    {registerForm.formState.errors.confirm_password ? (
                      <p className="text-sm text-destructive">
                        {registerForm.formState.errors.confirm_password.message}
                      </p>
                    ) : null}
                  </div>
                </div>

                <Button type="submit" disabled={isBusy} className="h-9 w-full">
                  {registerMutation.isPending ? <LockKeyhole /> : <UserPlus />}
                  {registerMutation.isPending ? "Creando cuenta..." : "Crear cuenta clinica"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <section className="hidden min-h-[560px] flex-col justify-between lg:flex">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-2 rounded-md border border-white/[0.15] bg-white/10 px-3 py-2 text-sm text-cyan-50 backdrop-blur">
              <Sparkles className="size-4 text-emerald-300" aria-hidden="true" />
              Laboratorio IVCM inteligente
            </div>

            <div className="max-w-2xl space-y-5">
              <h1 className="text-5xl font-semibold leading-tight tracking-normal text-white">
                Precision clinica con una interfaz mas viva.
              </h1>
              <p className="max-w-xl text-base leading-7 text-cyan-50/[0.78]">
                Analisis de imagenes, biomarcadores y revision medica en un flujo visual
                pensado para trabajo asistencial real.
              </p>
            </div>

            <div className="grid max-w-xl grid-cols-3 gap-3">
              {SIGNALS.map((signal) => (
                <div
                  key={signal.label}
                  className="rounded-lg border border-white/[0.14] bg-white/[0.09] p-3 shadow-lg shadow-black/10 backdrop-blur"
                >
                  <p className="text-xs uppercase text-cyan-100/60">{signal.label}</p>
                  <p className="mt-1 text-sm font-medium text-white">{signal.value}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-lg border border-white/[0.15] bg-black/[0.24] p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <Activity className="size-4 text-emerald-300" aria-hidden="true" />
                Senal de procesamiento
              </div>
              <ShieldCheck className="size-4 text-cyan-200" aria-hidden="true" />
            </div>
            <div className="auth-signal-panel grid h-40 content-end gap-2 rounded-md border border-white/10 bg-cyan-950/20 p-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="h-2 rounded-full bg-cyan-100/20"
                  style={{ width: `${48 + index * 11}%` }}
                >
                  <span
                    className="block h-full rounded-full bg-linear-to-r from-emerald-300 via-cyan-200 to-white/90"
                    style={{ animationDelay: `${index * 160}ms` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "inline-flex h-8 items-center justify-center gap-2 rounded-md px-3 text-sm font-medium transition-colors",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:bg-background/70 hover:text-foreground",
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function TechBackdrop() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="auth-grid absolute inset-0" />
      <div className="auth-scan absolute inset-y-0 left-[-20%] w-1/2" />
      <div className="auth-circuit absolute left-[6%] top-[12%] h-56 w-80" />
      <div className="auth-circuit auth-circuit-secondary absolute bottom-[8%] right-[8%] h-64 w-96" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-t from-black/[0.45] to-transparent" />
    </div>
  );
}
