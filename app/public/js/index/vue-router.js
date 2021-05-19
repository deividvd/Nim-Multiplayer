const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', name: 'Home', component: Home }
    // { path: '/404', component: NotFound },
    // { path: '*', redirect: '/404' }
  ]
})
