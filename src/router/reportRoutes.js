export default [
  {
    path: '/mainReport/:tipo/:nome',
    name: 'mainReport',
    component: () => import(/* webpackChunkName: "user" */ '@/views/report/MainReport2View.vue'),
    meta: { onlyUser: true }
  },
]
