import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-[#15181E] rounded-3xl border border-border/90 p-4 flex flex-col justify-between">
          <div className="relative aspect-square rounded-2xl bg-secondary mb-3.5 border border-border/60">
            <Skeleton className="absolute inset-0 rounded-2xl" />
          </div>

          <div className="flex items-center justify-between gap-1 mb-1.5">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-3 w-12 rounded-full" />
          </div>

          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-3/4 rounded-lg mt-2" />

          <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
            <div className="space-y-2">
              <Skeleton className="h-5 w-20 rounded-md" />
              <Skeleton className="h-3 w-16 rounded-md" />
            </div>

            <Skeleton className="h-8 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function CategoryGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white dark:bg-[#15181E] rounded-3xl border border-border/90 p-4 flex flex-col justify-between">
          <div className="relative aspect-square rounded-2xl bg-secondary mb-3.5 border border-border/60">
            <Skeleton className="absolute inset-0 rounded-2xl" />
          </div>

          <Skeleton className="h-4 w-3/4 rounded-lg" />
          <Skeleton className="h-3 w-1/2 rounded-full mt-2" />
          <Skeleton className="h-8 w-full rounded-xl mt-3" />
        </div>
      ))}
    </div>
  );
}
