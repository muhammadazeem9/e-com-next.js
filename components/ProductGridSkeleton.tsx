export default function ProductGridSkeleton() {
  return (
    <div className="mt-10 grid grid-cols-2 gap-x-1 gap-y-10 md:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[3/4] animate-pulse bg-fog" />
          <div className="mt-2 h-4 w-2/3 animate-pulse bg-fog" />
        </div>
      ))}
    </div>
  );
}
