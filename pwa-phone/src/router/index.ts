import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import PlayerLogin from '../components/PlayerLogin.vue'
import AdminApp from '@/pages/Admin.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: PlayerLogin,
  },
  {
    path: '/admin',
    name: 'Admin',
    component: AdminApp,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Защита: если нет playerId — отправить на /login
router.beforeEach((to, from, next) => {
  const playerId = localStorage.getItem('playerId')

  if (!playerId && to.path !== '/login') {
    next('/login')
  } else if (playerId && to.path === '/login') {
    next('/')
  } else {
    next()
  }
})

export default router
