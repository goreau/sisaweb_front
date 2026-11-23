export default [
  {
    path: '/pendencia',
    name: 'pendencia',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/utilitarios/ListaPendenciaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/visita',
    name: 'visita',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/utilitarios/ListaVisitaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/sorteio',
    name: 'sorteio',
    component: () => import(/* webpackChunkName: "user" */ '@/views/utilitarios/SorteioView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/mapa',
    name: 'mapa',
    component: () => import(/* webpackChunkName: "user" */ '@/views/utilitarios/MapaView.vue'),
    meta: { onlyUser: false },
  },
  {
    path: '/mapaCad',
    name: 'mapaCad',
    component: () => import(/* webpackChunkName: "user" */ '@/views/utilitarios/MapaCadView.vue'),
    meta: { onlyUser: false },
  },
]
