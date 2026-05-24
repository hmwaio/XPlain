export default function RightSidebar() {
  return (
    <div className="space-y-6">
      <div className="card p-4">
        <h3 className="font-semibold mb-3">Trending</h3>

        <div className="flex flex-wrap gap-2 text-sm">
          {["#react", "#webdev", "#typescript"].map((t) => (
            <span
              key={t}
              className="px-3 py-1 rounded-full bg-surface text-muted"
            >
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="card p-4">
        <h3 className="font-semibold mb-3">Who to follow</h3>
        <p className="text-sm text-muted">Coming soon...</p>
      </div>
    </div>
  );
}
