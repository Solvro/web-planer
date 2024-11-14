import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/types";
import { createUsosService } from "@/lib/usos";

export const revalidate = 3600;

interface PageProps {
  params: Promise<{ facultyId: string }>;
}

export async function GET(_request: Request, { params }: PageProps) {
  const { facultyId } = await params;
  const service = await createUsosService();
  return NextResponse.json(
    {
      registrations: await Promise.all(
        (await service.getRegistrations(facultyId)).map(async (r) => ({
          registration: r,
          courses: await Promise.all(
            r.related_courses.flatMap(async (c) => ({
              course: await service.getCourse(c.course_id),
              groups: await service.getGroups(c.course_id, c.term_id),
            })),
          ),
        })),
      ),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    },
  );
}

export type ApiFacultyDataGet = ApiResponse<typeof GET>;
