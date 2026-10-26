export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="w-8 h-8 border-2 border-lime-400 border-t-transparent rounded-full animate-spin" />
      <p className="mt-4 text-sm text-neutral-400">Loading...</p>
    </div>
  );
}
