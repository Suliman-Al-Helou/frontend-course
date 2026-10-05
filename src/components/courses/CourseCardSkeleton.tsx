export function SkeletonCard() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
      <div className="w-full h-48 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-muted rounded-lg w-3/4" />
        <div className="h-3 bg-muted rounded-lg w-1/3" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-3 bg-muted rounded-lg w-24" />
          <div className="h-3 bg-muted rounded-lg w-20" />
        </div>
        <div className="h-10 bg-muted rounded-xl mt-2" />
      </div>
    </div>
  );
}