export default function Loading() {
  return (
    <div className="container-page py-16" aria-busy="true" aria-label="Laen…">
      <div className="h-8 w-48 rounded bg-sand/80" />
      <div className="mt-6 h-40 rounded-2xl bg-sand/60" />
      <div className="mt-4 h-4 w-2/3 rounded bg-sand/50" />
      <div className="mt-2 h-4 w-1/2 rounded bg-sand/40" />
    </div>
  );
}
