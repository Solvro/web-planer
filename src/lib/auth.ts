import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

import { db } from "@/db";
import * as schema from "@/db/schema";

import { usosAuth } from "./auth/plugins/usos-auth";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: false },
  user: {
    additionalFields: {
      firstName: { type: "string", required: false, input: true },
      lastName: { type: "string", required: false, input: true },
      studentNumber: { type: "number", required: false, input: false },
      usosId: { type: "string", required: false, input: false },
      allowNotifications: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
      onboardingCompleted: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: true,
      },
    },
  },
  account: {
    accountLinking: { enabled: true, trustedProviders: ["usos", "email-otp"] },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log("===========================================");
        console.log(`[EMAIL OTP] Sending ${type} OTP to ${email}`);
        console.log(`[EMAIL OTP] Code: ${otp}`);
        console.log("===========================================");
      },
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: false,
    }),
    usosAuth(),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  trustedOrigins: [process.env.SITE_URL ?? "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
