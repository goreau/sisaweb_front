export default [
  {
    path: '/area/:id',
    name: 'area',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/area/AreaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/areas',
    name: 'areas',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/area/ListAreaView.vue'),
  },
  {
    path: '/censitario/:id',
    name: 'censitario',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/censitario/CensitarioView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/censitarios',
    name: 'censitarios',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/censitario/ListCensitarioView.vue'),
  },
  {
    path: '/quarteirao/:id',
    name: 'quarteirao',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/quarteirao/QuarteiraoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/quarteiraos',
    name: 'quarteiraos',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/quarteirao/ListQuarteiraoView.vue'),
  },
  {
    path: '/imovel/:id',
    name: 'imovel',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/imovel/ImovelView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/imovels',
    name: 'imovels',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/imovel/ListImovelView.vue'),
  },
  {
    path: '/ovitrampa/:id',
    name: 'ovitrampa',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/ovitrampa/OvitrampaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/ovitrampas',
    name: 'ovitrampas',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/ovitrampa/ListOvitrampaView.vue'),
  },
  {
    path: '/areaNav',
    name: 'areanav',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/areaNav/AreaNavView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/areaNavs',
    name: 'areanavs',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/areaNav/ListAreaNavView.vue'),
  },
  {
    path: '/areaNavChild',
    name: 'areaNavChild',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/areaNav/child/AreaNavScView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/equipe/:id',
    name: 'equipe',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/equipe/EquipeView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/produto/:id',
    name: 'produto',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/produto/ProdutoView.vue'),
    meta: { onlyAdmin: true },
  },
  {
    path: '/produtos',
    name: 'produtos',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/produto/ListProdutoView.vue'),
  },
  {
    path: '/edlCadastro/:id',
    name: 'edlCadastro',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/edl/CadastroEdlView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/edlCadastros',
    name: 'edlCadastros',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/edl/ListCadastroEdlView.vue'),
  },
  {
    path: '/bairro',
    name: 'bairro',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/bairro/BairroView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/bairros',
    name: 'bairros',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/bairro/ListBairroView.vue'),
  },
  {
    path: '/bairroChild',
    name: 'bairroChild',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/cadastro/bairro/child/BairroScView.vue'),
    meta: { onlyUser: true },
  },
]
