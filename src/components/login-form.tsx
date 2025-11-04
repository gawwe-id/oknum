"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ButtonPrimary } from "@/components/ui/button-primary";
import { ButtonGoogle } from "@/components/ui/button-google";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        setError(result.error.message || "Failed to sign in");
        return;
      }

      // Success - redirect to dashboard or home
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError(null);

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign in with Google"
      );
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <Link
              href="/"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <Image
                  src="/oknum.png"
                  alt="Oknum Studio"
                  width={28}
                  height={32}
                />
              </div>
              <span className="sr-only">Oknum Studio</span>
            </Link>
            <h1 className="text-xl font-bold">Selamat Datang Kembali</h1>
            <FieldDescription>
              Belum punya akun?{" "}
              <Link href="/signup" className="text-primary underline">
                Daftar
              </Link>
            </FieldDescription>
          </div>

          {error && (
            <Field className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              {...register("email")}
              aria-invalid={!!errors.email}
            />
            {errors.email && (
              <FieldError errors={[{ message: errors.email.message }]} />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="Masukkan password"
              {...register("password")}
              aria-invalid={!!errors.password}
            />
            {errors.password && (
              <FieldError errors={[{ message: errors.password.message }]} />
            )}
          </Field>

          <Field>
            <ButtonPrimary
              type="submit"
              disabled={isLoading || isGoogleLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk"
              )}
            </ButtonPrimary>
          </Field>

          <FieldSeparator>Or</FieldSeparator>

          <Field>
            <ButtonGoogle
              className="w-full"
              type="button"
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
              disabled={isLoading}
            />
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        Dengan melanjutkan, Kamu setuju dengan{" "}
        <a href="/terms-conditions" className="underline">
          Syarat dan Ketentuan
        </a>{" "}
        and{" "}
        <a href="/privacy-policy" className="underline">
          Kebijakan Privasi
        </a>
        .{" "}
      </FieldDescription>
    </div>
  );
}
