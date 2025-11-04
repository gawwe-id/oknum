"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

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
import { signupSchema, type SignupInput } from "@/lib/validations/auth";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const updateUserAfterSignup = useMutation(api.users.updateUserAfterSignup);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: undefined,
    },
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupInput) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        setError(result.error.message || "Failed to create account");
        return;
      }

      // Update user with phone and role="student" after Better Auth signup
      try {
        await updateUserAfterSignup({
          email: data.email,
          phone: data.phone || undefined,
          role: "student",
        });
      } catch (updateErr) {
        console.error("Failed to update user role:", updateErr);
        // Continue anyway - user is created, just role might not be set
      }

      // Success - redirect to home
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
      // Note: User creation with Google OAuth happens server-side
      // We'll need to ensure role="student" is set in the backend
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to sign up with Google"
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
              passHref
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
            <h1 className="text-xl font-bold">Buat Akun</h1>
            <FieldDescription>
              Sudah punya akun?{" "}
              <Link href="/login" className="text-primary underline">
                Masuk
              </Link>
            </FieldDescription>
          </div>

          {error && (
            <Field className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </Field>
          )}

          <Field>
            <FieldLabel htmlFor="name">Nama Lengkap</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="Nama Lengkap"
              {...register("name")}
              aria-invalid={!!errors.name}
            />
            {errors.name && (
              <FieldError errors={[{ message: errors.name.message }]} />
            )}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="email@contoh.com"
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
            <FieldDescription>
              Password harus minimal 8 karakter
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Nomor Telepon (Optional)</FieldLabel>
            <Input
              id="phone"
              type="tel"
              placeholder="081234567890"
              {...register("phone")}
              aria-invalid={!!errors.phone}
            />
            {errors.phone && (
              <FieldError errors={[{ message: errors.phone.message }]} />
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
                  Membuat akun...
                </>
              ) : (
                "Buat Akun"
              )}
            </ButtonPrimary>
          </Field>

          <FieldSeparator>Atau</FieldSeparator>

          <Field>
            <ButtonGoogle
              type="button"
              className="w-full"
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
