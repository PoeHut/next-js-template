export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          This main area now sits beside a left sidebar, with the same sidebar available on mobile.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {["Revenue", "Users", "Orders", "Growth"].map((item) => (
          <div key={item} className="bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-sm">{item}</p>
            <p className="mt-2 text-2xl font-semibold">--</p>
          </div>
        ))}
      </div>

      <div className="bg-card rounded-xl border p-6">
        <h2 className="text-lg font-semibold">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {[1, 2, 3].map((row) => (
            <div key={row} className="flex items-center justify-between rounded-lg border p-3">
              <p className="text-sm">Activity item {row}</p>
              <span className="text-muted-foreground text-xs">Just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
