export default [
  {
    path: '/mainReport/:tipo/:nome',
    name: 'mainReport',
    component: () => import(/* webpackChunkName: "user" */ '@/views/report/MainReportView.vue'),
    meta: { onlyUser: true }
  },
]
