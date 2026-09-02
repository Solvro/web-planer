import { Skeleton } from "@/components/ui/skeleton";

const DAYS = ["Pon", "Wt", "Śr", "Czw", "Pt"];

export default function PreviewPlanLoading() {
  return (
    <div className="flex w-full grow flex-col overflow-x-auto pt-16">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 md:px-14">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-9 w-36 rounded-md" />
      </div>

      <div className="flex gap-2 p-3">
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
