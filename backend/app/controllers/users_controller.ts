import type { HttpContext } from "@adonisjs/core/http";

import User from "#models/user";

export default class UsersController {
  /**
   * Toggle notifications for user. POST req without body.
   */
  async toggleNotifications({ auth }: HttpContext) {
    const userId = auth.user?.id;
    if (userId === undefined) {
      return { message: "User not authenticated." };
    }
    const user = await User.findOrFail(userId);
    user.allowNotifications = !user.allowNotifications;
    await user.save();
    return {
      message: "User notifications updated successfully",
      user: userId,
      success: true,
    };
  }
}
