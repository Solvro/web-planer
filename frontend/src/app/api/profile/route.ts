import { NextResponse } from "next/server";

import { createUsosService } from "@/lib/usos";

export const GET = async () => {
  try {
    await createUsosService().getProfile();

    return NextResponse.json(
      {
        msg: "Authorized",
      },
      {
        status: 200,
      },
    );
  } catch (e) {
    return NextResponse.json(
      {
        msg: "Unauthorized",
      },
      {
        status: 401,
      },
    );
  }
};
