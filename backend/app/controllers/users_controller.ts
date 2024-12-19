import type { HttpContext } from "@adonisjs/core/http";

import User from "#models/user";
import { createUserValidator } from "#validators/user";

export default class UsersController {
  /**
   * Update user data
   */
  async update({ request, auth }: HttpContext) {
    const payload = await request.validateUsing(createUserValidator);
    const userId = auth.user?.id;
    const currUser = await User.findOrFail(userId);
    currUser.merge(payload);
    await currUser.save();
    return {
      message: "User updated successfully",
      user: userId,
      success: true,
    };
  }
}
