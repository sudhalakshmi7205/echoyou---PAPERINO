export default function DashboardLoading() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-8 animate-pulse">
      <div className="h-10 w-64 bg-gray-100 rounded-lg" />
      <div className="grid grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 bg-gray-100 rounded-xl" />
        ))}
      </div>
      <div className="h-48 bg-gray-100 rounded-xl" />
      <div className="h-64 bg-gray-100 rounded-xl" />
    </div>
  )
}
