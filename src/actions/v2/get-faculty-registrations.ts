import redis from "@/lib/redis";
import { getOrSetRedis } from "@/lib/redis/get-set";
import { fetchUsosApi } from "@/lib/usos";

interface UsosRegistration {
    id: string;
    description: {
        pl: string;
    };
    status: string;
    type: string;
    www_instance: string;
}

interface FacultyRegistrationsDTO {
    id: string;
    description: string;
    status: string;
    type: string;
    wwwInstance: string;
}

function normalizeRegistrations(data: UsosRegistration[]): FacultyRegistrationsDTO[] {
    return data.map((reg: UsosRegistration) => ({
        id: reg.id,
        description: reg.description.pl,
        status: reg.status,
        type: reg.type,
        wwwInstance: reg.www_instance
    }));
}

export async function getFacultyRegistrationsAction(facultyId: string): Promise<FacultyRegistrationsDTO[]> {
    return getOrSetRedis({
        redis,
        key: `usos:faculty_registrations:${facultyId}`,
        ttlSeconds: 60 * 15,
        fetcher: async () => {
            const data = await fetchUsosApi<UsosRegistration[]>('registrations/faculty_registrations', {
                faculty_id: facultyId,
                active_only: true,
                user_related: false,
                fields: 'id|description|status|type|www_instance'
            });
            return normalizeRegistrations(data);
        }
    })

}