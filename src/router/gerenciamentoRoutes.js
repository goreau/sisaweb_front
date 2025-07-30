export default [
  {
    path: '/ciclo/:id',
    name: 'ciclo',
    component: () => import(/* webpackChunkName: "user" */ '@/views/gerenciamento/ciclo/CicloView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/ciclos',
    name: 'ciclos',
    component: () => import(/* webpackChunkName: "user" */ '@/views/gerenciamento/ciclo/ListCicloView.vue'),
  },
  {
    path: '/valAdl/:id',
    name: 'valAdl',
    component: () => import(/* webpackChunkName: "user" */ '@/views/gerenciamento/valAdl/ValAdlView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/valAdls',
    name: 'valAdls',
    component: () => import(/* webpackChunkName: "user" */ '@/views/gerenciamento/valAdl/ListValAdlView.vue'),
  },
]
