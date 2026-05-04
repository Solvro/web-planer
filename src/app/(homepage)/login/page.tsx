"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import SolvroLogoColor from "@/../public/assets/logo/logo_solvro_color.png";
import SolvroLogoMono from "@/../public/assets/logo/logo_solvro_mono.png";
import BgImage from "@/../public/assets/planer-bg.png";
import { handleTriggerConfetti } from "@/components/confetti";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import {
  loginOtpEmailSchema,
  otpPinSchema,
  userDataSchema,
} from "@/types/schemas";

export default function LoginPage() {
  const [email, setEmail] = React.useState("");
  const [step, setStep] = React.useState<"email" | "otp" | "onboard">("email");

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 pb-20 pt-20 sm:items-center sm:px-6 sm:pb-0 sm:pt-0">
      <Image
        src={BgImage}
        alt="bg img"
        unoptimized
        className="absolute inset-0 left-0 top-0 -z-10 h-full w-full opacity-30"
      />
      <div className="flex w-full max-w-md flex-col">
        <Link
          href="/"
          className="flex items-center gap-2 py-3 text-xs hover:underline"
        >
          <Icons.ArrowBack className="size-4" /> Powrót do strony głównej
        </Link>
        <div className="flex w-full flex-col items-center gap-2 rounded-lg bg-background p-5 py-9">
          <Image
            src={SolvroLogoColor}
            alt="Solvro Logo"
            width={100}
            height={100}
            className="block dark:hidden"
          />
          <Image
            src={SolvroLogoMono}
            alt="Solvro Logo"
            width={100}
            height={100}
            className="hidden dark:block"
          />
          {step !== "onboard" && (
            <>
              <h1 className="mt-5 text-center text-3xl font-bold">
                Zaloguj się do planera
              </h1>
              <p className="text-balance text-center text-sm text-muted-foreground">
                Podaj swój email z domeny Politechniki Wrocławskiej, na który
                wyślemy jednorazowy kod
              </p>
            </>
          )}

          {step === "email" && (
            <EmailStep setStep={setStep} setEmail={setEmail} />
          )}
          {step === "otp" && <OtpStep setStep={setStep} email={email} />}
          {step === "onboard" && <OnboardStep email={email} />}
        </div>
      </div>
    </div>
  );
}

function EmailStep({
  setStep,
  setEmail,
}: {
  setStep: (value: "email" | "otp") => void;
  setEmail: (value: string) => void;
}) {
  const form = useForm<z.infer<typeof loginOtpEmailSchema>>({
    resolver: zodResolver(loginOtpEmailSchema),
    defaultValues: { email: "" },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof loginOtpEmailSchema>) {
    const { error } = await authClient.emailOtp.sendVerificationOtp({
      email: values.email,
      type: "sign-in",
    });
    if (error !== null) {
      toast.error("Wystąpił błąd podczas wysyłania kodu");
      return;
    }
    setEmail(values.email);
    setStep("otp");
  }

  return (
    <div className="mt-5 flex w-full max-w-xs flex-col gap-4 text-center">
      <Button
        variant="outline"
        className="w-full"
        onClick={handleUsosLogin}
        type="button"
      >
        Zaloguj się przez USOS
      </Button>
      <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
        <span className="relative z-10 bg-background px-2 text-muted-foreground">
          Lub kontynuuj poprzez
        </span>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <FieldGroup>
          <Controller
            name="email"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="login-email">Adres e-mail</FieldLabel>
                <Input
                  {...field}
                  id="login-email"
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                  placeholder="123456@student.pwr.edu.pl"
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </FieldGroup>
        <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
          {isLoading ? <Icons.Loader className="size-4 animate-spin" /> : null}
          Wyślij kod
        </Button>
      </form>
    </div>
  );
}

function OtpStep({
  setStep,
  email,
}: {
  setStep: (value: "email" | "otp" | "onboard") => void;
  email: string;
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof otpPinSchema>>({
    resolver: zodResolver(otpPinSchema),
    defaultValues: { otp: "" },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof otpPinSchema>) {
    const { data, error } = await authClient.signIn.emailOtp({
      email,
      otp: values.otp,
    });
    if (error !== null) {
      toast.error(error.message ?? "Nieprawidłowy kod");
      return;
    }
    if (data.user.onboardingCompleted === true) {
      toast.success("Zalogowano pomyślnie");
      router.push("/plans");
    } else {
      handleTriggerConfetti();
      setStep("onboard");
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 max-w-xs space-y-6"
      >
        <Controller
          name="otp"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Hasło jednorazowe</FieldLabel>
              <InputOTP {...field} maxLength={6} id="otp-verification" required>
                <InputOTPGroup className="[&>*[data-slot=input-otp-slot]]:h-12 [&>*[data-slot=input-otp-slot]]:w-11 [&>*[data-slot=input-otp-slot]]:text-xl">
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator className="mx-2" />
                <InputOTPGroup className="[&>*[data-slot=input-otp-slot]]:h-12 [&>*[data-slot=input-otp-slot]]:w-11 [&>*[data-slot=input-otp-slot]]:text-xl">
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              <FieldDescription>
                Wpisz kod, który wylądował właśnie na Twoim adresie email
              </FieldDescription>
              {fieldState.invalid ? (
                <FieldError errors={[fieldState.error]} />
              ) : null}
            </Field>
          )}
        />
        <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
          {isLoading ? <Icons.Loader className="size-4 animate-spin" /> : null}
          Zaloguj się
        </Button>
      </form>
    </div>
  );
}

function OnboardStep({ email }: { email: string }) {
  const router = useRouter();

  const form = useForm<z.infer<typeof userDataSchema>>({
    resolver: zodResolver(userDataSchema),
    defaultValues: { firstName: "", lastName: "", email },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(payload: z.infer<typeof userDataSchema>) {
    try {
      await authClient.updateUser({
        firstName: payload.firstName,
        lastName: payload.lastName,
        name: `${payload.firstName} ${payload.lastName}`,
        studentNumber: Number.parseInt(payload.email.split("@")[0]),
        onboardingCompleted: true,
      });
      toast.success("Zapisano dane");
      router.push("/plans");
    } catch {
      toast.error("Wystąpił błąd podczas zapisywania danych");
    }
  }

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Witaj w Planerze!</h1>
      <p className="text-balance text-center text-sm text-muted-foreground">
        Jeśli chcesz, możesz zapisać swoje imię i nazwisko
      </p>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 w-full max-w-xs space-y-1"
      >
        <div className="mb-6 flex flex-col items-center gap-2 md:flex-row">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="onboard-firstname">Imię</FieldLabel>
                <Input
                  {...field}
                  id="onboard-firstname"
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                  placeholder="Jan"
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="onboard-lastname">Nazwisko</FieldLabel>
                <Input
                  {...field}
                  id="onboard-lastname"
                  aria-invalid={fieldState.invalid}
                  disabled={isLoading}
                  placeholder="Kowalski"
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : null}
              </Field>
            )}
          />
        </div>
        <Button type="submit" size="sm" className="w-full" disabled={isLoading}>
          {isLoading ? <Icons.Loader className="size-4 animate-spin" /> : null}
          Zapisz dane
        </Button>
        <Button
          type="button"
          size="sm"
          className="w-full"
          variant="ghost"
          asChild
        >
          <Link href="/plans">Pomiń</Link>
        </Button>
      </form>
    </div>
  );
}

async function handleUsosLogin() {
  try {
    await authClient.signIn.usos({
      callbackURL: "/plans",
    });
  } catch (error) {
    console.error(error);
    toast.error("Wystąpił błąd podczas logowania przez USOS");
  }
}
