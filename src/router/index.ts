import { createRouter, createWebHistory } from '@ionic/vue-router'
import ListView from '@/views/ListView.vue'
import InsertView from '@/views/InsertView.vue'
import DetailView from '@/views/DetailView.vue'

const routes = [
  { path: '/', name: 'list', component: ListView },
  { path: '/insert', name: 'insert', component: InsertView },
  { path: '/detail/:id', name: 'detail', component: DetailView, props: true },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
