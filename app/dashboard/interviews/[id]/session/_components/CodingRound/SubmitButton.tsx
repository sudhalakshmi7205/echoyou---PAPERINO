import { CheckCircle2 } from 'lucide-react'

export default function SubmitButton({
  onSubmit,
  isSubmitting
}: {
  onSubmit: () => void
  isSubmitting: boolean
}) {
  return (
    <div className="absolute bottom-6 right-6">
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-full shadow-lg shadow-purple-900/20 transition-all disabled:opacity-50 disabled:hover:bg-purple-600"
      >
        {isSubmitting ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <CheckCircle2 className="w-4 h-4" />
        )}
        {isSubmitting ? 'Submitting...' : 'Submit Solution'}
      </button>
    </div>
  )
}
