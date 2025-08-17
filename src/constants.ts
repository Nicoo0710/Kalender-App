// Globale Schalter für das Verhalten in Browser/Simulator/Gerät

// Auf "false" lassen, solange du im Simulator testest.
// Später auf einem echten iPhone auf "true" stellen, um den nativen Kalender zu benutzen.
export const USE_NATIVE = false as boolean;

// Hilfsfunktion für Datumsausgabe "dd.mm.yyyy hh:mm"
export function formatDE(dateString: string) {
  const d = new Date(dateString)
  return (
    d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
    ' ' +
    d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })
  )
}
