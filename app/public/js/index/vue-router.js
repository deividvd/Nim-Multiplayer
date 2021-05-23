const router = new VueRouter({
  mode: 'history',
    routes: [
      { path: '/', name: 'Home', component: Home },
      { path: '/register', name: 'Register', component: Register },
      { path: '/login', name: 'Login', component: Login },
      { path: '/404', component: NotFoundError },
      { path: '*', redirect: '/404' }
    ]
  })