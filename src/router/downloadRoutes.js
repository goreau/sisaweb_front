export default [
  {
    path: '/downloads',
    name: 'downloads',
    component: () =>
      import(/* webpackChunkName: "user" */ '@/views/downloads/MainDownloadView.vue'),
    meta: { onlyUser: true },
  },
  {
    path: '/gerenciaForum',
    name: 'gerenciaForum',
    component: () => import(/* webpackChunkName: "user" */ '@/views/forum/GerenciaForumView.vue'),
    meta: { onlyUser: true },
  },
]
