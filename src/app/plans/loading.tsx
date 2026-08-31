import { Skeleton } from "@/components/ui/skeleton";

export default function PlansLoading() {
  return (
    <div className="container mx-auto max-h-full flex-1 grow overflow-y-auto p-4 pt-24">
      <div className="grid grid-cols-2 gap-4 sm:justify-start md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="aspect-square rounded-lg" />
        ))}
      </div>
    </div>
  );
}
