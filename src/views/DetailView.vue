<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Termindetails</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="event">
        <h2>{{ event.title }}</h2>
        <p><strong>Ort:</strong> {{ event.location || '–' }}</p>
        <p><strong>Start:</strong> {{ formatDate(event.startDate) }}</p>
        <p><strong>Ende:</strong> {{ formatDate(event.endDate) }}</p>
        <p><strong>Ganztägig:</strong> {{ event.allDay ? 'Ja' : 'Nein' }}</p>

        <ion-button
          v-if="event.location"
          expand="block"
          color="primary"
          @click="openMap"
        >
          Ort in Karte anzeigen
        </ion-button>

        <ion-button
          v-if="event.location"
          expand="block"
          color="medium"
          @click="copyLocation"
        >
          Ort kopieren
        </ion-button>

        <ion-button expand="block" color="danger" @click="confirmDelete">
          Termin löschen
        </ion-button>
        <ion-button expand="block" @click="$router.push('/')">Zurück</ion-button>
      </div>

      <div v-else>
        <p>Termin nicht gefunden.</p>
        <ion-button expand="block" @click="$router.push('/')">Zurück</ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, alertController
} from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { Clipboard } from '@capacitor/clipboard'
import { USE_NATIVE, formatDE } from '../constants'

type CalendarEvent = {
  id: string
  title: string
  location?: string
  startDate: string
  endDate: string
  allDay: boolean
}

export default defineComponent({
  name: 'DetailView',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton },
  data() {
    return { event: null as null | CalendarEvent }
  },
  methods: {
    formatDate: formatDE,
    openMap() {
      if (this.event?.location) {
        const query = encodeURIComponent(this.event.location)
        if (Capacitor.getPlatform() === 'ios') {
          window.open(`maps://?q=${query}`, '_system')
        } else {
          window.open(`https://maps.google.com/?q=${query}`, '_system')
        }
      }
    },
    async copyLocation() {
      if (this.event?.location) {
        await Clipboard.write({ string: this.event.location })
        alert('Ort kopiert!')
      }
    },
    async confirmDelete() {
      const alert = await alertController.create({
        header: 'Bestätigen',
        message: 'Willst du diesen Termin wirklich löschen?',
        buttons: [
          { text: 'Abbrechen', role: 'cancel' },
          { text: 'Löschen', handler: this.deleteEvent }
        ]
      })
      await alert.present()
    },
    async deleteEvent() {
      const id = this.$route.params.id as string

      if (!USE_NATIVE || !Capacitor.isNativePlatform()) {
        const events = JSON.parse(localStorage.getItem('events') || '[]')
        const updated = events.filter((e: CalendarEvent) => e.id !== id)
        localStorage.setItem('events', JSON.stringify(updated))
        alert('Termin gelöscht')
        this.$router.push('/')
        return
      }

      const { Calendar } = await import('@ebarooni/capacitor-calendar')
      await Calendar.deleteEvent({ id })
      this.$router.push('/')
    }
  },
  async mounted() {
    const id = this.$route.params.id as string

    if (!USE_NATIVE || !Capacitor.isNativePlatform()) {
      const events: CalendarEvent[] = JSON.parse(localStorage.getItem('events') || '[]')
      this.event = events.find((e: CalendarEvent) => e.id === id) || null
      return
    }

    const { Calendar } = await import('@ebarooni/capacitor-calendar')
    const result = await Calendar.findAllEvents({})
    this.event = (result.events || []).find((e: CalendarEvent) => e.id === id) || null
  }
})
</script>
