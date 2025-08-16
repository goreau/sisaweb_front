export default [
  {
    path: '/mainReport/:tipo/:nome',
    name: 'mainReport',
    component: () => import(/* webpackChunkName: "user" */ '@/views/report/MainReport2View.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/tabelaCruzada',
    name: 'tabelaCruzada',
    component: () => import(/* webpackChunkName: "user" */ '@/views/report/TabelaCruzadaView.vue'),
    meta: { onlyUser: true }
  },
]
