<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Neuer Termin</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-item>
        <ion-label position="stacked">Titel</ion-label>
        <ion-input v-model="title" placeholder="Titel eingeben"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Ort</ion-label>
        <ion-input v-model="location" placeholder="Ort eingeben"></ion-input>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Startdatum</ion-label>
        <ion-datetime v-model="startDate"></ion-datetime>
      </ion-item>

      <ion-item>
        <ion-label position="stacked">Enddatum</ion-label>
        <ion-datetime v-model="endDate"></ion-datetime>
      </ion-item>

      <ion-item>
        <ion-label>Ganztägig</ion-label>
        <ion-checkbox v-model="allDay"></ion-checkbox>
      </ion-item>

      <ion-button expand="block" color="primary" @click="saveEvent">Speichern</ion-button>
      <ion-button expand="block" color="medium" @click="cancel">Abbrechen</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonDatetime, IonCheckbox, IonButton
} from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { USE_NATIVE } from '../constants'

type CalendarEvent = {
  id: string
  title: string
  location?: string
  startDate: string
  endDate: string
  allDay: boolean
  color?: string
}

export default defineComponent({
  name: 'InsertView',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonDatetime, IonCheckbox, IonButton
  },
  data() {
    const now = new Date()
    const in1h = new Date(now.getTime() + 60 * 60 * 1000)
    return {
      title: '',
      location: '',
      startDate: now.toISOString(),
      endDate: in1h.toISOString(),
      allDay: false,
      color: 'blue' as 'red' | 'blue' | 'green' | 'yellow' | 'blue'
    }
  },
  methods: {
    cancel() { this.$router.back() },
    async saveEvent() {
      if (!this.title) { alert('Titel darf nicht leer sein.'); return }

      // Ganztägig → 00:00 – 00:00 nächster Tag
      if (this.allDay) {
        const start = new Date(this.startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(start)
        end.setDate(end.getDate() + 1)
        this.startDate = start.toISOString()
        this.endDate = end.toISOString()
      }

      // ECHTES Gerät (nur wenn USE_NATIVE = true)
      if (USE_NATIVE && Capacitor.isNativePlatform()) {
        try {
          const { Calendar } = await import('@ebarooni/capacitor-calendar')
          const granted = await Calendar.requestReadWritePermission()
          if (!granted) throw new Error('Keine Kalender-Berechtigung')

          await Calendar.createEvent({
            title: this.title,
            location: this.location,
            startDate: this.startDate,
            endDate: this.endDate,
            allDay: this.allDay
          })

          alert('Termin im Geräte‑Kalender gespeichert.')
          this.$router.replace('/')
          return
        } catch (err) {
          console.warn('[Calendar] Fallback auf LocalStorage:', err)
        }
      }

      // Fallback (Browser/Simulator)
      const events: CalendarEvent[] = JSON.parse(localStorage.getItem('events') || '[]')
      const newEvent: CalendarEvent = {
        id: Date.now().toString(),
        title: this.title,
        location: this.location,
        startDate: this.startDate,
        endDate: this.endDate,
        allDay: this.allDay,
        color: this.color
      }
      events.push(newEvent)
      localStorage.setItem('events', JSON.stringify(events))
      alert('Termin lokal gespeichert (Simulator/ohne Berechtigung).')
      this.$router.replace('/')
    }
  }
})
</script>
