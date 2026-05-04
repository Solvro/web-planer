import { createTransport } from "nodemailer";
import type { ReactElement } from "react";
import { render } from "react-email";

import { env } from "@/env.mjs";

const transport = createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth:
    env.SMTP_PASSWORD === undefined
      ? undefined
      : { user: env.SMTP_USERNAME, pass: env.SMTP_PASSWORD },
});

interface SendMailOptions {
  to: string;
  subject: string;
  template: ReactElement;
}

export async function sendMail({ to, subject, template }: SendMailOptions) {
  if (env.SMTP_PASSWORD === undefined || env.SMTP_PASSWORD === "") {
    // eslint-disable-next-line no-console
    console.log(`[MAILER DEV] To: ${to} | Subject: ${subject}`);
    return;
  }

  const html = await render(template);

  await transport.sendMail({
    from: `"Solvro Planer" <${env.SMTP_USERNAME}>`,
    to,
    subject,
    html,
  });
}
