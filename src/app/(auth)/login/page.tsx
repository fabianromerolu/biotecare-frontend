"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LockKeyhole, LogIn, Microscope } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { APP_NAME } from "@/lib/constants";
import { LoginSchema, type LoginInput } from "@/lib/schemas/auth";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loginMutation } = useAuth();
  const form = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/patients");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="grid min-h-screen place-items-center px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Microscope className="size-7" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold">{APP_NAME}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Acceso para oftalmologos</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar sesion</CardTitle>
            <CardDescription>Autenticacion OAuth2 contra la API FastAPI local.</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="grid gap-4"
              onSubmit={form.handleSubmit((values) => loginMutation.mutate(values))}
            >
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={Boolean(form.formState.errors.email)}
                  {...form.register("email")}
                />
                {form.formState.errors.email ? (
                  <p className="text-sm text-destructive">{form.formState.errors.email.message}</p>
                ) : null}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Contrasena</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={Boolean(form.formState.errors.password)}
                  {...form.register("password")}
                />
                {form.formState.errors.password ? (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                ) : null}
              </div>
              <Button type="submit" disabled={loginMutation.isPending} className="w-full">
                {loginMutation.isPending ? <LockKeyhole /> : <LogIn />}
                {loginMutation.isPending ? "Validando" : "Entrar"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Alert>
          <LockKeyhole className="size-4" aria-hidden="true" />
          <AlertTitle>GDPR Art. 9 - Datos de salud</AlertTitle>
          <AlertDescription>Solo personal medico autorizado.</AlertDescription>
        </Alert>
      </div>
    </div>
  );
}
