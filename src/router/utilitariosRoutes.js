export default [
  {
    path: '/sorteio',
    name: 'sorteio',
    component: () => import(/* webpackChunkName: "user" */ '@/views/utilitarios/SorteioView.vue'),
    meta: { onlyUser: true },
  },
]
