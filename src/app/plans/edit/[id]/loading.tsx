import { Skeleton } from "@/components/ui/skeleton";

export default function EditPlanLoading() {
  return (
    <div className="flex h-screen w-full items-center justify-center pt-20">
      <Skeleton className="h-full w-full max-w-6xl rounded-lg" />
    </div>
  );
}
