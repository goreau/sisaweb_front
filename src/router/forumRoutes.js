export default [
  {
    path: '/mainForum',
    name: 'mainForum',
    component: () => import(/* webpackChunkName: "user" */ '@/views/forum/MainForumView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/gerenciaForum',
    name: 'gerenciaForum',
    component: () => import(/* webpackChunkName: "user" */ '@/views/forum/GerenciaForumView.vue'),
    meta: { onlyUser: true }
  },
]
