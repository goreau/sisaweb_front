export default [
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
]
