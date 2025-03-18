import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  service: 'smtp',
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
})
