import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt"];

export default function EditPlanLoading() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <aside className="hidden h-svh w-(--sidebar-width) shrink-0 border-r pt-20 md:block">
        <div className="ml-4 flex max-h-screen w-[calc(100%-2rem)] flex-col gap-4 px-2">
          <div className="flex w-full items-end gap-1">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-9 w-full" />
            </div>
            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
          </div>

          <Skeleton className="h-3 w-48" />

          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-36 rounded-md" />
            <Skeleton className="h-9 w-9 shrink-0 rounded-md" />
          </div>

          <div className="w-full space-y-1">
            <Skeleton className="h-3 w-14" />
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="w-full space-y-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-9 w-full" />
          </div>

          <div className="flex w-full flex-1 flex-col gap-3 overflow-hidden pt-2">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2 border-b pb-3">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-7 shrink-0 rounded-md" />
                  <Skeleton className="h-4 flex-1" />
                </div>
                <Skeleton className="ml-9 h-3 w-3/4" />
                <Skeleton className="ml-9 h-3 w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 gap-3 overflow-x-auto p-3 pt-24">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex min-w-[200px] flex-1 flex-col rounded-lg border p-3"
          >
            <Skeleton className="mb-3 h-6 w-20" />
            <div className="flex flex-1 flex-col gap-2">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton
                  key={index}
                  className="w-full flex-1 rounded-md"
                  style={{ opacity: 1 - index * 0.12 }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
