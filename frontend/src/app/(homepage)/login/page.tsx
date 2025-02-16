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
import { sendOtpToEmail } from "@/actions/login";
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
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { loginOtpEmailSchema, otpPinSchema } from "@/types/schemas";

export default function LoginPage() {
  const [isLoading, setIsLoading] = React.useState(false);
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
      console.log(result);
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
      pin: "",
    },
  });

  function onSubmitOtp(data: z.infer<typeof otpPinSchema>) {
    toast("You submitted the following values:", {
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
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
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5 w-full max-w-xs space-y-5"
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
                  className="float-right"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Icons.Loader className="size-4 animate-spin" />
                  ) : null}
                  Zaloguj się do planera
                </Button>
              </form>
            </Form>
          )}
          {step === "otp" && (
            <div className="flex w-full flex-col items-center justify-center">
              <Form {...formOtp}>
                <form
                  onSubmit={formOtp.handleSubmit(onSubmitOtp)}
                  className="mt-5 w-2/3 space-y-6"
                >
                  <FormField
                    control={formOtp.control}
                    name="pin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>One-Time Password</FormLabel>
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
                          Please enter the one-time password sent to your phone.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" size={"sm"} className="float-right">
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
