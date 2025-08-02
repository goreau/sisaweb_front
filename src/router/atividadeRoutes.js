export default [
  {
    path: '/imCadastrado',
    name: 'imCadastrado',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/imCadastrado/ImCadastradoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/imCadastrados',
    name: 'imCadastrados',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/atividade/imCadastrado/ListImCadastradoView.vue'
      ),
  },
  {
    path: '/recipientes',
    name: 'recipientes',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/recipiente/recipienteView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vigLinha',
    name: 'vigLinha',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/vigControle/vcVisitaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vigImoveis',
    name: 'vigImoveis',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/vigControle/vcImovelView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/recipientesVc/:idImovel',
    name: 'recipientesVc',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/recipiente/recipienteVCView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vigQuadra',
    name: 'vigQuadra',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/vigControle/vcQuadraView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vcVisitas',
    name: 'vcVisitas',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/vigControle/ListVcVisitaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vcOvitrampa/:id',
    name: 'vcOvitrampa',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/ovitrampa/vcOvitrampaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vcOvitrampas',
    name: 'vcOvitrampas',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/atividade/ovitrampa/ListVcOvitrampaView.vue'
      ),
  },
  {
    path: '/otOvitrampa/:id',
    name: 'otOvitrampa',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/ovitrampa/otOvitrampaView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/otOvitrampas',
    name: 'otOvitrampas',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/atividade/ovitrampa/ListOtOvitrampaView.vue'
      ),
  },
  {
    path: '/vcAlado',
    name: 'vcAlado',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/alado/vcAladoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/imAlado',
    name: 'imAlado',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/alado/imAladoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vcAlados',
    name: 'vcAlados',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/alado/ListVcAladoView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/veicular/:id',
    name: 'veicular',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/veicular/VeicularView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/veiculars',
    name: 'veiculars',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/veicular/ListVeicularView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vcBri',
    name: 'vcBri',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/bri/vcBriView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/imBri',
    name: 'imBri',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/bri/imBriView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/vcBris',
    name: 'vcBris',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/atividade/bri/ListVcBriView.vue'),
    meta: { onlyUser: true },
  },
]
