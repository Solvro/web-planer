import { Icons } from "@/components/icons";

export default function Loading() {
  return (
    <div className="flex w-full flex-1 flex-col items-center justify-center">
      <Icons.Loader size={64} className="mb-4 animate-spin text-primary" />
      <h1 className="text-lg font-medium">Ładowanie twojego planu...</h1>
      <p className="text-xs text-muted-foreground">To potrwa tylko chwilkę</p>
    </div>
  );
}
