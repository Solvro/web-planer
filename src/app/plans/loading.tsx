import { Skeleton } from "@/components/ui/skeleton";

export default function PlansLoading() {
  return (
    <div className="container mx-auto max-h-full flex-1 grow overflow-y-auto p-4 pt-20">
      <div className="mb-6 flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div
            key={index}
            className="flex flex-col gap-3 rounded-xl border p-4"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-28" />
            <div className="mt-1 flex gap-2 border-t pt-3">
              <Skeleton className="h-9 w-9 rounded-md" />
              <Skeleton className="h-9 flex-1 rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
