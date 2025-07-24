import { DateTime } from "luxon";
import crypto from "node:crypto";

import { HttpContext } from "@adonisjs/core/http";
import mail from "@adonisjs/mail/services/main";

import User from "#models/user";
import { getOtpValidator, verifyOtpValidator } from "#validators/otp";

import { createClient } from "../usos/usos_client.js";

export default class AuthController {
  async loginWithUSOS({ request, response, auth }: HttpContext) {
    const { accessToken, accessSecret } = request.only([
      "accessToken",
      "accessSecret",
    ]) as { accessToken: string; accessSecret: string };
    const usosClient = createClient({
      token: accessToken,
      secret: accessSecret,
    });
    const profile = await usosClient.get<{
      id: string;
      student_number: string;
      first_name: string;
      last_name: string;
      photo_urls: Record<string, string>;
    }>("users/user?fields=id|student_number|first_name|last_name|photo_urls");
    const user = await User.updateOrCreate(
      { studentNumber: profile.student_number },
      {
        usosId: profile.id,
        firstName: profile.first_name,
        lastName: profile.last_name,
        avatar: profile.photo_urls["50x50"],
        verified: true,
      },
    );

    await auth.use("jwt").generate(user);

    return response.ok({
      ...user.serialize(),
    });
  }

  async getOTP({ request, response }: HttpContext) {
    const data = request.all();
    const { email } = await getOtpValidator.validate(data);
    const testEmail = process.env.TEST_EMAIL;

    const studentNumber = email.split("@")[0];
    let user = await User.findBy("studentNumber", studentNumber);
    if (user === null) {
      user = await User.create({
        usos_id: "",
        studentNumber,
        firstName: "",
        lastName: "",
        avatar: "",
        verified: false,
      });
    }

    let otp = crypto.randomInt(100000, 999999);
    if (testEmail === email) {
      otp = 123456; // For testing purposes, use a fixed OTP
    }

    user.otpCode = otp.toString();
    user.otpAttempts = 0;
    user.otpExpire = DateTime.now().plus({ minutes: 15 });
    await user.save();

    if (testEmail !== email) {
      await mail.send((message) => {
        message
          .from("Solvro Planer <planer@solvro.pl>")
          .to(email)
          .subject("Zweryfikuj adres email")
          .text(`Twój kod weryfikacyjny to: ${otp}`)
          .html(`<h1>Twój kod weryfikacyjny to: ${otp}</h1>`);
      });
    }

    return response.ok({
      success: true,
      message: "Wysłano kod weryfikacyjny",
    });
  }

  async verifyOTP({ request, response, auth }: HttpContext) {
    const data = request.all();
    const { email, otp } = await verifyOtpValidator.validate(data);
    const user = await User.query()
      .where("studentNumber", email.split("@")[0])
      .where("otp_expire", ">", new Date())
      .first();
    if (user === null) {
      return response.unauthorized({
        message: "Logowanie nieudane.",
        error: "Invalid OTP",
      });
    }

    if (user.blocked) {
      return response.unauthorized({
        message:
          "Twoje konto zostało zablokowane na logowanie OTP. Skontaktuj się z administratorem.",
        error: "User is blocked",
      });
    }

    if (user.otpCode !== otp.toString()) {
      user.otpAttempts += 1;
      await user.save();
      if (user.otpAttempts >= 5) {
        user.otpCode = null;
        user.otpExpire = null;
        user.blocked = true;
        await user.save();
        return response.unauthorized({
          message:
            "Logowanie nieudane. Twoje konto zostało zablokowane na logowanie poprzez OTP.",
          error: "Too many attempts",
        });
      }
      return response.unauthorized({
        message: "Logowanie nieudane.",
        error: "Invalid OTP",
      });
    }

    await auth.use("jwt").generate(user);

    let isNewAccount = false;
    if (user.verified === false) {
      isNewAccount = true;
    }
    user.verified = true;
    user.otpCode = null;
    user.otpExpire = null;
    await user.save();

    return response.ok({
      success: true,
      user: user.serialize(),
      isNewAccount,
    });
  }

  async logout({ response }: HttpContext) {
    response.clearCookie("token");

    return response.ok({ message: "Successfully logged out" });
  }
}
