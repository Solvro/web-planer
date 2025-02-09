import type { HttpContext } from "@adonisjs/core/http";

import Shared from "#models/shared";
import { createSharedValidator } from "#validators/shared";

export default class SahredController {
  /**
   * Display a list of resource
   */
  async index(_ctx: HttpContext) {
    return Shared.query();
  }

  /**
   * Handle form submission for the create action
   */
  async store({ request }: HttpContext) {
    const payload = await request.validateUsing(createSharedValidator);
    const shared = await Shared.create(payload);
    return { message: "Shared plan created.", shared };
  }

  /**
   * Show individual record
   */
  async show({ params }: HttpContext) {
    try {
      const plan = await Shared.findOrFail(params.id);
      return { success: true, plan };
    } catch {
      return { success: false, message: "Shared plan not found." };
    }
  }
}
