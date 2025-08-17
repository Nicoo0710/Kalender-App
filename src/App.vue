<template>
  <ion-app>
    <ion-page>
      <router-view />
    </ion-page>
  </ion-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonApp, IonPage } from '@ionic/vue'

export default defineComponent({
  name: 'App',
  components: { IonApp, IonPage }
})
</script>
