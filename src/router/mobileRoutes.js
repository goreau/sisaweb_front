export default [
  {
    path: '/listMobVcImovel',
    name: 'listMobVcImovel',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/ListMobVcImovelView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/mobVcImovel',
    name: 'mobVcImovel',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobImCadastradoView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/listMobVcFolha',
    name: 'listMobVcFolha',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/ListMobVcFolhaView.vue'),
  },
  {
    path: '/mobVcVisita',
    name: 'mobVcVisita',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobVcVisitaView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/mobRecipiente',
    name: 'mobRecipiente',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobRecipienteView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/mobExecucao',
    name: 'mobExecucao',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobExecucaoView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/mobSisamob',
    name: 'mobSisamob',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobSisamobView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/logSisamob',
    name: 'logSisamob',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobLogView.vue'),
    meta: { onlyUser: true }
  },
]
