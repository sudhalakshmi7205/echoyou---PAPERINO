import { Hammer } from 'lucide-react'

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-6 p-6 text-center animate-in fade-in slide-in-from-bottom-4">
      <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center border border-gray-700 shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-purple-500/20 animate-pulse" />
        <Hammer className="w-10 h-10 text-gray-400 relative z-10" />
      </div>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
        <p className="text-gray-400 max-w-md mx-auto">
          We are currently building this feature. Check back soon for updates!
        </p>
      </div>
    </div>
  )
}
