export default function ShopLoading() {
  return (
    <div className="container-page py-12 md:py-16" aria-busy aria-label="Laen…">
      <div className="h-8 w-40 rounded bg-sand/80" />
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[4/5] rounded-2xl bg-sand/60" />
            <div className="h-4 w-3/4 rounded bg-sand/50" />
            <div className="h-3 w-1/2 rounded bg-sand/40" />
          </div>
        ))}
      </div>
    </div>
  );
}
