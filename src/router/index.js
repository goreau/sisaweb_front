import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/general/HomeView.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/acesso-negado',
      name: 'AcessoNegado',
      component: () => import(/* webpackChunkName: "login" */ '../views/general/AcessoNegado.vue'),
    },
    {
      path: '/',
      name: 'loginHome',
      component: () => import(/* webpackChunkName: "login" */ '../views/user/LoginView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/user/LoginView.vue')
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
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/general/AjudaView.vue'),
    },
    {
      path: '/user',
      name: 'user',
      component: () => import(/* webpackChunkName: "user" */ '../views/user/UserView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/users',
      name: 'users',
      component: () => import(/* webpackChunkName: "user" */ '../views/user/ListUsersView.vue'),
    },
    {
      path: '/troca',
      name: 'troca',
      component: () => import(/* webpackChunkName: "user" */ '../views/user/TrocaUserView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/editUser/:id',
      name: 'editUser',
      component: () => import(/* webpackChunkName: "user" */ '../views/user/EditUserView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/mycad',
      name: 'cadastro',
      component: () => import(/* webpackChunkName: "home" */ '../views/user/MyCadastroView.vue'),
    },
    {
      path: '/area/:id',
      name: 'area',
      component: () => import(/* webpackChunkName: "user" */ '../views/area/AreaView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/areas',
      name: 'areas',
      component: () => import(/* webpackChunkName: "user" */ '../views/area/ListAreaView.vue'),
    },
    {
      path: '/editArea/:id',
      name: 'editArea',
      component: () => import(/* webpackChunkName: "user" */ '../views/area/EditAreaView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/censitario',
      name: 'censitario',
      component: () => import(/* webpackChunkName: "user" */ '../views/censitario/CensitarioView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/censitarios',
      name: 'censitarios',
      component: () => import(/* webpackChunkName: "user" */ '../views/censitario/ListCensitarioView.vue'),
    },
    {
      path: '/editCensitario/:id',
      name: 'editCensitario',
      component: () => import(/* webpackChunkName: "user" */ '../views/censitario/EditCensitarioView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/quarteirao',
      name: 'quarteirao',
      component: () => import(/* webpackChunkName: "user" */ '../views/quarteirao/QuarteiraoView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/quarteiraos',
      name: 'quarteiraos',
      component: () => import(/* webpackChunkName: "user" */ '../views/quarteirao/ListQuarteiraoView.vue'),
    },
    {
      path: '/editQuarteirao/:id',
      name: 'editQuarteirao',
      component: () => import(/* webpackChunkName: "user" */ '../views/quarteirao/EditQuarteiraoView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/imovel',
      name: 'imovel',
      component: () => import(/* webpackChunkName: "user" */ '../views/imovel/ImovelView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/imovels',
      name: 'imovels',
      component: () => import(/* webpackChunkName: "user" */ '../views/imovel/ListImovelView.vue'),
    },
    {
      path: '/editImovel/:id',
      name: 'editImovel',
      component: () => import(/* webpackChunkName: "user" */ '../views/imovel/EditImovelView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/areaNav',
      name: 'areanav',
      component: () => import(/* webpackChunkName: "user" */ '../views/areaNav/AreaNavView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/areaNavs',
      name: 'areanavs',
      component: () => import(/* webpackChunkName: "user" */ '../views/areaNav/ListAreaNavView.vue'),
    },
    {
      path: '/editAreaNav/:id',
      name: 'editAreaNav',
      component: () => import(/* webpackChunkName: "user" */ '../views/imovel/EditImovelView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/areaNavChild',
      name: 'areaNavChild',
      component: () => import(/* webpackChunkName: "user" */ '../views/areaNav/child/AreaNavScView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/equipe',
      name: 'equipe',
      component: () => import(/* webpackChunkName: "user" */ '../views/imovel/ImovelView.vue'),
      meta: { onlyUser: true }
    },
    {
      path: '/equipes',
      name: 'equipes',
      component: () => import(/* webpackChunkName: "user" */ '../views/imovel/ListImovelView.vue'),
    },
  ],
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isConv = [6, 7, 8].includes(auth.user?.nivel)
  if (to.meta.onlyUser && isConv) {
    return next('/acesso-negado')
  }
  next()
})

export default router
