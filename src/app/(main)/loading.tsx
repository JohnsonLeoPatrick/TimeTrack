export default function Loading() {
  return (
    <div role="status" aria-label="Loading page" className="min-h-screen px-6 pb-24 pt-32">
      <div aria-hidden="true" className="mx-auto max-w-6xl space-y-8">
        <div className="mx-auto h-10 w-64 rounded-xl bg-slate-100" />
        <div className="mx-auto h-4 w-48 rounded bg-slate-100" />
        <div className="grid gap-6 pt-8 md:grid-cols-3">
          {[0, 1, 2].map((index) => (
            <div key={index} className="h-72 rounded-2xl border border-slate-300 bg-slate-100" />
          ))}
        </div>
      </div>
    </div>
  );
}
