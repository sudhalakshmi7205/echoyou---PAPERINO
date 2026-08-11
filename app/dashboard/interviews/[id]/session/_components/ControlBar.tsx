import { SkipForward, Repeat, Square } from 'lucide-react'

export default function ControlBar({
  onSkip,
  onRepeat,
  onEnd,
  disabled
}: {
  onSkip: () => void
  onRepeat: () => void
  onEnd: () => void
  disabled: boolean
}) {
  return (
    <div className="flex items-center justify-center gap-4 py-4 px-6 border-t border-gray-800 bg-[#1C1C1C]">
      <button
        onClick={onRepeat}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        <Repeat className="w-4 h-4" />
        Repeat
      </button>

      <button
        onClick={onSkip}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        <SkipForward className="w-4 h-4" />
        Skip
      </button>

      <div className="w-px h-6 bg-gray-800 mx-2" />

      <button
        onClick={onEnd}
        disabled={disabled}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors disabled:opacity-50"
      >
        <Square className="w-4 h-4" />
        End Interview
      </button>
    </div>
  )
}
