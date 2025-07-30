export default [
  {
    path: '/area/:id',
    name: 'area',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/area/AreaView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/areas',
    name: 'areas',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/area/ListAreaView.vue'),
  },
  {
    path: '/censitario/:id',
    name: 'censitario',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/censitario/CensitarioView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/censitarios',
    name: 'censitarios',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/censitario/ListCensitarioView.vue'),
  },
  {
    path: '/quarteirao/:id',
    name: 'quarteirao',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/quarteirao/QuarteiraoView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/quarteiraos',
    name: 'quarteiraos',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/quarteirao/ListQuarteiraoView.vue'),
  },
  {
    path: '/imovel/:id',
    name: 'imovel',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/imovel/ImovelView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/imovels',
    name: 'imovels',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/imovel/ListImovelView.vue'),
  },
  {
    path: '/ovitrampa/:id',
    name: 'ovitrampa',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/ovitrampa/OvitrampaView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/ovitrampas',
    name: 'ovitrampas',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/ovitrampa/ListOvitrampaView.vue'),
  },
  {
    path: '/areaNav',
    name: 'areanav',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/areaNav/AreaNavView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/areaNavs',
    name: 'areanavs',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/areaNav/ListAreaNavView.vue'),
  },
  {
    path: '/areaNavChild',
    name: 'areaNavChild',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/areaNav/child/AreaNavScView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/equipe/:id',
    name: 'equipe',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/equipe/EquipeView.vue'),
    meta: { onlyUser: true }
  }
]
