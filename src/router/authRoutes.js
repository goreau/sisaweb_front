export default [
  {
    path: '/',
    name: 'loginHome',
    component: () => import(/* webpackChunkName: "login" */ '@/views/cadastro/user/LoginView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/cadastro/user/LoginView.vue')
  },
  {
    path: '/user/:id',
    name: 'user',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/user/UserView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/users',
    name: 'users',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/user/ListUsersView.vue'),
  },
  {
    path: '/troca',
    name: 'troca',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/user/TrocaUserView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/editUser/:id',
    name: 'editUser',
    component: () => import(/* webpackChunkName: "user" */ '@/views/cadastro/user/EditUserView.vue'),
    meta: { onlyUser: true }
  },
  {
    path: '/mycad',
    name: 'cadastro',
    component: () => import(/* webpackChunkName: "home" */ '@/views/cadastro/user/MyCadastroView.vue'),
  },
]
