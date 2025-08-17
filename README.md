# Kalender-App (Ionic Vue + Capacitor iOS)

Einfache Kalender-App:
- Listenansicht aller Termine (aufsteigend)
- Detailansicht: Titel, Ort, Start/Ende, Ganztägig (Ja/Nein), "Ort in Karte anzeigen", Löschen
- Einfügeansicht: legt Termine an; Ganztägig setzt Ende automatisch (+24h)
- iOS: nativer Kalender via Plugin; Browser/Simulator-Fallback via LocalStorage

## Tech-Stack
- Vue 3, Ionic Vue, Vite
- Capacitor
- Plugin: @ebarooni/capacitor-calendar

## Development (Web)
- npm install
- npm run build
- npm run preview

## iOS starten
- bash npx cap sync ios
- npx cap open ios

