import OtpEmail from "@emails/otp-email";
import { betterAuth } from "better-auth";
import { usosAuth } from "better-auth-usos";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import React from "react";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env.mjs";
import { sendMail } from "@/lib/mailer";

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "pg", schema }),
  emailAndPassword: { enabled: false },
  user: {
    additionalFields: {
      firstName: { type: "string", required: false, input: true },
      lastName: { type: "string", required: false, input: true },
      studentNumber: { type: "number", required: false, input: true },
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
    accountLinking: {
      enabled: true,
      trustedProviders: ["usos-auth", "email-otp"],
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await sendMail({
          to: email,
          subject: "Kod logowania do Planera | KN Solvro",
          template: React.createElement(OtpEmail, { otp }),
        });
      },
      otpLength: 6,
      expiresIn: 300,
      sendVerificationOnSignUp: false,
    }),
    usosAuth({
      usosBaseUrl: env.USOS_APPS_URL,
      consumerKey: env.USOS_CONSUMER_KEY,
      consumerSecret: env.USOS_CONSUMER_SECRET,
      scopes: "studies|offline_access",
      emailDomain: "student.pwr.edu.pl",
      userFields: (usosProfile) => ({
        studentNumber:
          usosProfile.student_number == null
            ? null
            : Number.parseInt(usosProfile.student_number),
        usosId: usosProfile.id,
        firstName: usosProfile.first_name,
        lastName: usosProfile.last_name,
        onboardingCompleted: true,
      }),
      // eslint-disable-next-line @typescript-eslint/require-await
      onSuccess: async (user) => {
        console.warn(
          `[USOS AUTH] User logged in: ${user.firstName} ${user.lastName} (${user.studentNumber?.toString() ?? "N/A"})`,
        );
        return "/plans";
      },
    }),
    nextCookies(),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },
  trustedOrigins: [process.env.SITE_URL ?? "http://localhost:3000"],
});

export type Session = typeof auth.$Infer.Session;
