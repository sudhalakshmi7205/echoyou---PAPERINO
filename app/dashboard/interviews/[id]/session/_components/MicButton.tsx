import { Mic, Square } from 'lucide-react'
import { useState } from 'react'

export default function MicButton({
  onStart,
  onStop,
  disabled
}: {
  onStart: () => void
  onStop: () => void
  disabled: boolean
}) {
  const [recording, setRecording] = useState(false)

  function toggle() {
    if (recording) {
      onStop()
      setRecording(false)
    } else {
      onStart()
      setRecording(true)
    }
  }

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2">
      <button
        onClick={toggle}
        disabled={disabled}
        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all shadow-xl ${
          disabled 
            ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
            : recording 
              ? 'bg-red-500 text-white animate-pulse hover:bg-red-600 scale-110' 
              : 'bg-purple-600 text-white hover:bg-purple-500 hover:scale-105'
        }`}
      >
        {recording ? <Square className="w-6 h-6 fill-current" /> : <Mic className="w-7 h-7" />}
      </button>
      
      {recording && (
        <div className="absolute top-full mt-3 left-1/2 -translate-x-1/2 text-xs font-medium text-red-400 animate-pulse whitespace-nowrap">
          Listening...
        </div>
      )}
    </div>
  )
}
