import { getPreferences } from '../actions'
import PreferencesForm from './_components/PreferencesForm'

export default async function PreferencesPage() {
  const prefs = await getPreferences()

  return (
    <div className="flex flex-col gap-6">
      <PreferencesForm initialPrefs={prefs} />
    </div>
  )
}
