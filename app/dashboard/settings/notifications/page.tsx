import { getPreferences } from '../actions'
import NotificationsForm from './_components/NotificationsForm'

export default async function NotificationsPage() {
  const prefs = await getPreferences()

  return (
    <div className="flex flex-col gap-6">
      <NotificationsForm initialPrefs={prefs} />
    </div>
  )
}
