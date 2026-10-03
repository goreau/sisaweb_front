export default [
  {
    path: '/sisaMap',
    name: 'sisaMap',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mapa/MainMapaView.vue'),
    meta: { onlyUser: false },
  },
]
