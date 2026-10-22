export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-4 py-2">
      <div className="h-8 w-48 rounded-lg bg-forest/10" />
      <div className="h-4 w-72 rounded bg-forest/5" />
      <div className="mt-8 space-y-3">
        <div className="h-16 rounded-2xl bg-ivory" />
        <div className="h-16 rounded-2xl bg-ivory" />
        <div className="h-16 rounded-2xl bg-ivory" />
      </div>
    </div>
  );
}
