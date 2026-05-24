export function PostSkeleton() {
  return (
    <div className="rounded-xl bg-card p-4 ring-1 ring-border">
      <div className="flex items-center gap-2.5">
        <div className="h-7 w-7 rounded-full shimmer" />
        <div className="h-3 w-40 rounded-full shimmer" />
      </div>
      <div className="mt-4 h-4 w-5/6 rounded-md shimmer" />
      <div className="mt-2 h-3 w-full rounded-md shimmer" />
      <div className="mt-2 h-3 w-2/3 rounded-md shimmer" />
      <div className="mt-4 flex gap-2">
        <div className="h-8 w-24 rounded-full shimmer" />
        <div className="h-8 w-16 rounded-full shimmer" />
        <div className="h-8 w-16 rounded-full shimmer" />
      </div>
    </div>
  );
}
