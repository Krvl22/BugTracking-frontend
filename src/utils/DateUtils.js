/**
 * Safely format a date value for display.
 * Returns fallback string if date is null, undefined, or invalid.
 */
export const formatDate = (value, fallback = "No date set") => {
  if (!value) return fallback
  const d = new Date(value)
  if (isNaN(d.getTime())) return fallback
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}