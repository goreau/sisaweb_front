export default [
  {
    path: '/listMobVcImovel',
    name: 'listMobVcImovel',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/mobile/ListMobVcImovelView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/mobVcImovel',
    name: 'mobVcImovel',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/mobile/MobImCadastradoView.vue'),
    meta: { onlyUser: true },
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
    meta: { onlyUser: true },
  },
  {
    path: '/listMobEdl',
    name: 'listMobEdl',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/ListMobEdlView.vue'),
  },
  {
    path: '/mobEdl/:id',
    name: 'mobEdl',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobEdlView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/listMobAlado',
    name: 'listMobAlado',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/ListMobAladoView.vue'),
  },
  {
    path: '/mobAlado/:id',
    name: 'mobAlado',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobAladoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/mobRecipiente',
    name: 'mobRecipiente',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobRecipienteView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/mobExecucao',
    name: 'mobExecucao',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobExecucaoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/mobProdutoImovel',
    name: 'mobProdutoImovel',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/mobile/ProdutoImCadastradoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/mobProdutoFolha',
    name: 'mobProdutoFolha',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/mobile/ProdutoVcVisitaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/mobSisamob',
    name: 'mobSisamob',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobSisamobView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/logSisamob',
    name: 'logSisamob',
    component: () => import(/* webpackChunkName: "user" */ '@/views/mobile/MobLogView.vue'),
    meta: { onlyUser: true },
  },
]
