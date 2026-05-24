"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  LockKeyhole,
  LogIn,
  Mail,
  Microscope,
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
    <div className="auth-stage relative isolate min-h-screen overflow-hidden text-white">
      <TechBackdrop />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-8">
        <Card className="w-full max-w-[22rem] rounded-xl border-white/30 bg-white/[0.96] py-5 text-foreground shadow-2xl shadow-cyan-950/40 backdrop-blur-xl sm:max-w-sm">
          <CardHeader className="gap-4 px-6 pb-1">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                <Microscope className="size-6" aria-hidden="true" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold">{APP_NAME}</CardTitle>
                <CardDescription>Acceso clinico seguro</CardDescription>
              </div>
            </div>

            <div className="grid grid-cols-2 rounded-lg border bg-muted/50 p-1">
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

          <CardContent className="px-6">
            {mode === "login" ? (
              <form
                className="grid gap-4"
                onSubmit={loginForm.handleSubmit((values) => loginMutation.mutate(values))}
              >
                <div className="grid gap-1.5">
                  <Label htmlFor="email">Correo electronico</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
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
                    <LockKeyhole className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
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
      aria-pressed={active ? "true" : "false"}
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
