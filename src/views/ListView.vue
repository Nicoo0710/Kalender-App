<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Alle Termine</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item
          v-for="event in events"
          :key="event.id ?? event.title"
          button
          @click="$router.push(`/detail/${event.id ?? 'demo'}`)"
        >
          <ion-label>
            <h2>{{ event.title }}</h2>
            <p>{{ formatDate(event.startDate) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <div v-if="events.length === 0" class="ion-padding">
        <p>Keine Termine vorhanden.</p>
      </div>

      <ion-button expand="full" @click="$router.push('/insert')">
        Neuen Termin hinzufügen
      </ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonList, IonItem, IonLabel, IonButton
} from '@ionic/vue'
import { Capacitor } from '@capacitor/core'
import { USE_NATIVE, formatDE } from '../constants'

export default defineComponent({
  name: 'ListView',
  components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton },
  data() {
    return {
      events: [] as Array<{ id?: string; title: string; startDate: string }>
    }
  },
  methods: {
    formatDate: formatDE,
    async loadEvents() {
      // Simulator/Browsertest: immer LocalStorage
      if (!USE_NATIVE || !Capacitor.isNativePlatform()) {
        this.events = JSON.parse(localStorage.getItem('events') || '[]')
          .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
        return
      }

      // Nativ (ECHTES Gerät, wenn USE_NATIVE=true)
      try {
        const { Calendar } = await import('@ebarooni/capacitor-calendar')
        const granted = await Calendar.requestReadWritePermission()
        if (granted) {
          const result = await Calendar.findAllEvents({})
          this.events = (result?.events ?? []).sort(
            (a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
          )
        } else {
          this.events = []
        }
      } catch (e) {
        console.warn('[Calendar] Laden fehlgeschlagen, nutze LocalStorage {}', e)
        this.events = JSON.parse(localStorage.getItem('events') || '[]')
          .sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
      }
    }
  },
  async ionViewWillEnter() { await this.loadEvents() },
  async mounted() { await this.loadEvents() }
})
</script>
