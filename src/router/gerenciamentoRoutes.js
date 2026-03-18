export default [
  {
    path: '/ciclo/:id',
    name: 'ciclo',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/gerenciamento/ciclo/CicloView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/ciclos',
    name: 'ciclos',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/gerenciamento/ciclo/ListCicloView.vue'),
  },
  {
    path: '/valAdl/:id',
    name: 'valAdl',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/gerenciamento/valAdl/ValAdlView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/valAdls',
    name: 'valAdls',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/gerenciamento/valAdl/ListValAdlView.vue'),
  },
  {
    path: '/duplicaCensitario',
    name: 'duplicaCensitario',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/duplicidades/ListDuplicaCensitarioView.vue'
      ),
  },
  {
    path: '/duplicaQuarteirao',
    name: 'duplicaQuarteirao',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/duplicidades/ListDuplicaQuarteiraoView.vue'
      ),
  },
  {
    path: '/duplicaImovel',
    name: 'duplicaImovel',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/duplicidades/ListDuplicaImovelView.vue'
      ),
  },
  {
    path: '/duplicaCadOvi',
    name: 'duplicacadOvi',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/duplicidades/ListDuplicaCadOviView.vue'
      ),
  },
  {
    path: '/duplicaCadastroOvi',
    name: 'duplicaCadastroOvi',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/duplicidades/ListDuplicaOvitrampaCadastroView.vue'
      ),
  },
  {
    path: '/duplicaOvitrampa',
    name: 'duplicaOvitrampa',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/duplicidades/ListDuplicaOvitrampaView.vue'
      ),
  },
  {
    path: '/duplicaUser',
    name: 'duplicaUser',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/duplicidades/ListDuplicaUserView.vue'
      ),
  },
  {
    path: '/trocaUserIm',
    name: 'trocaUserIm',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/proprietario/trocaUserImView.vue'
      ),
  },
  {
    path: '/trocaUserVC',
    name: 'trocaUserVC',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/proprietario/trocaUserVCView.vue'
      ),
  },
  {
    path: '/trocaUserCad',
    name: 'trocaUserCad',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/proprietario/trocaUserCadastroView.vue'
      ),
  },
  {
    path: '/trocaUserCadParc',
    name: 'trocaUserCadParc',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/proprietario/uniformizaUserView.vue'
      ),
  },
  {
    path: '/contaOvosLogs',
    name: 'contaOvosLogs',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/gerenciamento/contaOvos/listaLogsView.vue'),
  },
  {
    path: '/contaOvosLogFile',
    name: 'contaOvosLogFile',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/proprietario/trocaUserCadastroView.vue'
      ),
  },
  {
    path: '/contaOvos/:id',
    name: 'contaOvos',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/gerenciamento/contaOvos/contaOvosView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/contaOvoss',
    name: 'contaovoss',
    component: () =>
      import(
        /* webpackChunkName: "user" */ '@/views/gerenciamento/contaOvos/ListContaOvosView.vue'
      ),
  },
  {
    path: '/contaOvosAdm',
    name: 'contaovosadm',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/gerenciamento/contaOvos/AdmContaOvosView.vue'),
  },
]
