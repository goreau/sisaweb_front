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
  {
    path: '/testeChart',
    name: 'Teste Gráfico',
    component: () => import(/* webpackChunkName: "user" */ '@/views/report/TesteChartView.vue'),
    meta: { onlyUser: true }
  },
]
