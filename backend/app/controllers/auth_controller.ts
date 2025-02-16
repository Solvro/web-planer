import { DateTime } from "luxon";
import assert from "node:assert";

import { HttpContext } from "@adonisjs/core/http";
import mail from "@adonisjs/mail/services/main";

import User from "#models/user";

import { createClient } from "../usos/usos_client.js";

export default class AuthController {
  //login with usos
  async store({ request, response, auth }: HttpContext) {
    /**
     * Step 1: Get credentials from the request body
     */
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
      let user = await User.findBy("usos_id", profile.id);
      if (user === null) {
        user = await User.create({
          usos_id: profile.id,
          studentNumber: profile.student_number,
          firstName: profile.first_name,
          lastName: profile.last_name,
          avatar: profile.photo_urls["50x50"],
          verified: true,
        });
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

  //get otp for login
  async show({ request, response }: HttpContext) {
    /**
     * Step 1: Get credentials from the request body
     */
    const { email } = request.only(["email"]) as { email: string };
    try {
      const studentNumber = email.split("@")[0];
      let user = await User.findBy("studentNumber", studentNumber);
      if (user === null) {
        // generate random 10 digit id
        const customId = Math.floor(1000000000 + Math.random() * 9000000000);
        user = await User.create({
          usos_id: customId,
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

      //send email
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
      return response.unauthorized({
        message: "Login failed.",
        error: error.message,
        success: false,
      });
    }
  }

  //login with otp
  async update({ request, response, auth }: HttpContext) {
    /**
     * Step 1: Get credentials from the request body
     */
    // const { otp } = request.only(["otp"]) as { otp: string };
    const { otp, email } = request.only(["otp", "email"]) as {
      otp: string;
      email: string;
    };
    try {
      const user = await User.query()
        .where("email", email)
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

  // logout
  async destroy({ response }: HttpContext) {
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
