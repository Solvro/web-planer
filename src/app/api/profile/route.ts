import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/types";
import { createUsosService } from "@/lib/usos";

export async function GET() {
  return NextResponse.json(await createUsosService().getProfile());
}

export type ApiProfileGet = ApiResponse<typeof GET>;
