export default function Loading() {
  return (
    <div className="grid min-h-[60vh] place-items-center bg-ink" role="status" aria-label="Loading">
      <div className="relative size-14">
        <span className="absolute inset-0 animate-ping rounded-full bg-amber/40" />
        <span className="absolute inset-2 rounded-full bg-amber" />
      </div>
    </div>
  );
}
