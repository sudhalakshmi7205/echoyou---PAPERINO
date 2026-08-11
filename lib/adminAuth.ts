export const ADMIN_EMAIL = 'sudharajsekar2005@gmail.com'

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false
  return email.toLowerCase().trim() === ADMIN_EMAIL.toLowerCase().trim()
}
