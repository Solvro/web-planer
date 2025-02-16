"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import SolvroLogoColor from "@/../public/assets/logo/logo_solvro_color.png";
import SolvroLogoMono from "@/../public/assets/logo/logo_solvro_mono.png";
import BgImage from "@/../public/assets/planer-bg.png";
import { sendOtpToEmail, verifyOtp } from "@/actions/login";
import { handleTriggerConfetti } from "@/components/confetti";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import type { VerifyOtpReponseType } from "@/types";
import { loginOtpEmailSchema, otpPinSchema } from "@/types/schemas";

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [email, setEmail] = React.useState("");
  const [step, setStep] = React.useState<"email" | "otp">("email");

  const form = useForm<z.infer<typeof loginOtpEmailSchema>>({
    resolver: zodResolver(loginOtpEmailSchema),
    defaultValues: {
      email: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof loginOtpEmailSchema>) {
    setIsLoading(true);
    try {
      const result = await sendOtpToEmail(values);
      if (!result.success) {
        toast.error("Wystąpił błąd podczas wysyłania kodu");
        return;
      }
      setEmail(values.email);
      setStep("otp");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const formOtp = useForm<z.infer<typeof otpPinSchema>>({
    resolver: zodResolver(otpPinSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmitOtp(data: z.infer<typeof otpPinSchema>) {
    setIsLoading(true);
    try {
      const response = (await verifyOtp(email, data)) as VerifyOtpReponseType;
      if (response.success) {
        if (response.user.firstName === "") {
          // new account = trigger onboard
          handleTriggerConfetti();
        } else {
          toast.success("Zalogowano pomyślnie");
          window.location.href = "/plans";
        }
      } else {
        toast.error("Nieprawidłowy kod");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center">
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
          <h1 className="mt-5 text-3xl font-bold">Zaloguj się do planera</h1>
          <p className="text-balance text-center text-sm text-muted-foreground">
            Podaj swój email z domeny Politechniki Wrocławskiej, na który
            wyślemy jednorazowy kod
          </p>

          {step === "email" && (
            <div className="mt-5 flex w-full max-w-xs flex-col gap-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/api/login">Zaloguj się przez USOS</Link>
              </Button>
              <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                  Lub kontunuuj poprzez
                </span>
              </div>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="w-full space-y-5"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres e-mail</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="123456@student.pwr.edu.pl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    size={"sm"}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Icons.Loader className="size-4 animate-spin" />
                    ) : null}
                    Wyślij kod
                  </Button>
                </form>
              </Form>
            </div>
          )}
          {step === "otp" && (
            <div className="flex w-full flex-col items-center justify-center">
              <Form {...formOtp}>
                <form
                  onSubmit={formOtp.handleSubmit(onSubmitOtp)}
                  className="mt-5 max-w-xs space-y-6"
                >
                  <FormField
                    control={formOtp.control}
                    name="otp"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Hasło jednorazowe</FormLabel>
                        <FormControl>
                          <InputOTP maxLength={6} {...field}>
                            <InputOTPGroup>
                              <InputOTPSlot index={0} />
                              <InputOTPSlot index={1} />
                              <InputOTPSlot index={2} />
                              <InputOTPSlot index={3} />
                              <InputOTPSlot index={4} />
                              <InputOTPSlot index={5} />
                            </InputOTPGroup>
                          </InputOTP>
                        </FormControl>
                        <FormDescription>
                          Wpisz kod, który wylądował właśnie na Twoim adresie
                          email
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    size={"sm"}
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Icons.Loader className="size-4 animate-spin" />
                    ) : null}
                    Zaloguj się
                  </Button>
                </form>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
