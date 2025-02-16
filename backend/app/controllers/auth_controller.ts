import assert from "node:assert";

import { HttpContext } from "@adonisjs/core/http";

import User from "#models/user";

import { createClient } from "../usos/usos_client.js";

export default class AuthController {
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
