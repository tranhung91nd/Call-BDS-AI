export default function Loading() {
  return (
    <div className="space-y-5 max-w-7xl animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-6 bg-surface-2 rounded-[8px] w-40 mb-2" />
        <div className="h-4 bg-surface-2/70 rounded-[8px] w-80" />
      </div>

      {/* KPI grid skeleton (4 cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="kpi-card">
            <div className="flex items-center justify-between mb-3">
              <div className="h-3 bg-surface-2 rounded w-24" />
              <div className="w-8 h-8 bg-surface-2 rounded-[10px]" />
            </div>
            <div className="h-8 bg-surface-2 rounded w-16 mb-2" />
            <div className="h-3 bg-surface-2/70 rounded w-32" />
          </div>
        ))}
      </div>

      {/* Content block skeleton */}
      <div className="card p-5 space-y-3">
        <div className="h-5 bg-surface-2 rounded w-48" />
        <div className="space-y-2">
          <div className="h-4 bg-surface-2 rounded w-full" />
          <div className="h-4 bg-surface-2 rounded w-5/6" />
          <div className="h-4 bg-surface-2 rounded w-4/6" />
        </div>
      </div>
    </div>
  )
}
