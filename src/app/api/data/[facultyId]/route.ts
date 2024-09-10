/* eslint-disable @eslint-community/eslint-comments/disable-enable-pair */
import { NextResponse } from "next/server";

import type { ApiResponse } from "@/lib/types";
import { createUsosService } from "@/lib/usos";

export const revalidate = 3600;

export async function GET(
  _request: Request,
  { params }: { params: { facultyId: string } },
) {
  const service = createUsosService();

  try {
    const registrations = await Promise.all(
      (await service.getRegistrations(params.facultyId)).map(async (r) => ({
        registration: r,
        courses: await Promise.all(
          r.related_courses.flatMap(async (c) => ({
            course: await service.getCourse(c.course_id),
            groups: await service.getGroups(c.course_id, c.term_id),
          })),
        ),
      })),
    );

    return NextResponse.json(
      { registrations },
      {
        headers: { "Cache-Control": "public, max-age=3600" },
      },
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    return new Response(`Internal Server Error ${error}`, { status: 200 });
  }
}

export type ApiProfileGet = ApiResponse<typeof GET>;
