import { db } from '@/lib/db'
import PromptEditor from './_components/PromptEditor'

export default async function PromptsPage() {
  const prompts: any[] = []
  
  const active = {
    interview: undefined,
    evaluation: undefined,
    resume: undefined
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">AI Prompts</h1>
        <p className="text-sm text-gray-400 mt-1">Manage system instructions for the Echo interview engine.</p>
      </div>
      
      <PromptEditor active={active} history={prompts} />
    </div>
  )
}
