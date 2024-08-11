import { createUsosService } from "@/lib/usos";

export async function GET() {
  return Response.json(await createUsosService().getProfile());
}
