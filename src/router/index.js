import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/general/HomeView.vue'
import { useAuthStore } from '@/stores/auth';
import authRoutes from './authRoutes';
import { storeToRefs } from 'pinia';
import cadastroRoutes from './cadastroRoutes';
import gerenciamentoRoutes from './gerenciamentoRoutes';
import atividadeRoutes from './atividadeRoutes';
import mobileRoutes from './mobileRoutes';
import reportRoutes from './reportRoutes';


const routes = [
  ...authRoutes,
  ...cadastroRoutes,
  ...gerenciamentoRoutes,
  ...atividadeRoutes,
  ...mobileRoutes,
  ...reportRoutes,
  {
    path: '/acesso-negado',
    name: 'AcessoNegado',
    component: () => import(/* webpackChunkName: "login" */ '../views/general/AcessoNegado.vue'),
  },

  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (About.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/general/AboutView.vue'),
  },
  {
    path: '/ajuda',
    name: 'ajuda',
    component: () => import('../views/general/AjudaView.vue'),
  },

];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})


router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const { user } = storeToRefs(auth)

  const isConv = [6, 7, 8].includes(user.value?.nivel)

  if (to.meta.onlyUser && isConv) {
    return next('/acesso-negado')
  }

  next()
})

export default router
