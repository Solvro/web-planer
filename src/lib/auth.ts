/* eslint-disable no-console */
import { betterAuth } from "better-auth";
import { usosAuth } from "better-auth-usos";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { emailOTP } from "better-auth/plugins";
import { createTransport } from "nodemailer";

import { db } from "@/db";
import * as schema from "@/db/schema";
import { env } from "@/env.mjs";

const mailer = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth:
    env.SMTP_PASSWORD === ""
      ? undefined
      : { user: env.SMTP_USERNAME, pass: env.SMTP_PASSWORD },
});

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
        if (env.SMTP_PASSWORD === "") {
          console.log("===========================================");
          console.log(`[EMAIL OTP DEV] Code for ${email}: ${otp}`);
          console.log("===========================================");
          return;
        }
        await mailer.sendMail({
          from: `"Solvro Planer" <${env.SMTP_USERNAME as string}>`,
          to: email,
          subject: "Kod logowania do Planera | KN Solvro",
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
              <h2 style="color: #1a1a1a;">Twój kod logowania</h2>
              <p style="color: #555;">Użyj poniższego kodu, aby zalogować się do Planera Solvro:</p>
              <div style="background: #f4f4f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
                <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #1a1a1a;">${otp}</span>
              </div>
              <p style="color: #888; font-size: 13px;">Kod jest ważny przez 5 minut. Jeśli nie próbowałeś się zalogować, zignoruj tę wiadomość.</p>
            </div>
          `,
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
        console.log(
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
