import { DateTime } from "luxon";
import assert from "node:assert";

import { HttpContext } from "@adonisjs/core/http";
import mail from "@adonisjs/mail/services/main";

import User from "#models/user";

import { createClient } from "../usos/usos_client.js";

export default class AuthController {
  async loginWithUSOS({ request, response, auth }: HttpContext) {
    const { accessToken, accessSecret } = request.only([
      "accessToken",
      "accessSecret",
    ]) as { accessToken: string; accessSecret: string };
    try {
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
      let user = await User.findBy("student_number", profile.student_number);
      if (user === null) {
        user = await User.create({
          usos_id: profile.id,
          studentNumber: profile.student_number,
          firstName: profile.first_name,
          lastName: profile.last_name,
          avatar: profile.photo_urls["50x50"],
          verified: true,
        });
      } else if (
        user.avatar !== profile.photo_urls["50x50"] ||
        user.firstName !== profile.first_name ||
        user.lastName !== profile.last_name ||
        user.usosId !== profile.id
      ) {
        user.avatar = profile.photo_urls["50x50"];
        user.firstName = profile.first_name;
        user.lastName = profile.last_name;
        user.usosId = profile.id;
        await user.save();
      }

      await auth.use("jwt").generate(user);

      return response.ok({
        ...user.serialize(),
      });
    } catch (error) {
      assert(error instanceof Error);
      return response.unauthorized({
        message: "Login failed.",
        error: error.message,
      });
    }
  }

  async getOTP({ request, response }: HttpContext) {
    const { email } = request.only(["email"]) as { email: string };
    try {
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

      const otp = Math.floor(100000 + Math.random() * 900000);
      user.otpCode = otp.toString();
      user.otpExpire = DateTime.now().plus({ minutes: 15 });
      await user.save();

      await mail.send((message) => {
        message
          .from("Solvro Planer <planer@solvro.pl>")
          .to(email)
          .subject("Zweryfikuj adres email")
          .text(`Twój kod weryfikacyjny to: ${otp}`)
          .html(`<h1>Twój kod weryfikacyjny to: ${otp}</h1>`);
      });

      return response.ok({
        success: true,
        message: "Wysłano kod weryfikacyjny",
      });
    } catch (error) {
      assert(error instanceof Error);
      return response.internalServerError({
        message: "Login failed.",
        error: error.message,
        success: false,
      });
    }
  }

  async verifyOTP({ request, response, auth }: HttpContext) {
    const { otp, email } = request.only(["otp", "email"]) as {
      otp: string;
      email: string;
    };
    try {
      const user = await User.query()
        .where("studentNumber", email.split("@")[0])
        .where("otp_code", otp)
        .where("otp_expire", ">", new Date())
        .first();
      if (user === null) {
        return response.unauthorized({
          message: "Login failed.",
          error: "Invalid OTP",
        });
      }

      await auth.use("jwt").generate(user);

      user.verified = true;
      user.otpCode = null;
      user.otpExpire = null;
      await user.save();

      return response.ok({
        success: true,
        user: user.serialize(),
      });
    } catch (error) {
      assert(error instanceof Error);
      return response.unauthorized({
        message: "Login failed.",
        error: error.message,
      });
    }
  }

  async logout({ response }: HttpContext) {
    try {
      response.clearCookie("token");

      return response.ok({ message: "Successfully logged out" });
    } catch (error) {
      assert(error instanceof Error);
      return response.internalServerError({
        message: "Logout failed",
        error: error.message,
      });
    }
  }
}
