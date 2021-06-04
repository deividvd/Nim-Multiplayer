const router = new VueRouter({
  mode: 'history',
    routes: [
      HomeRoute,
      { path: '/privacy', component: Privacy },
      { path: '/terms-of-service', component: TermsOfService },
      RegisterRoute,
      LoginRoute,
      { path: '/account', component: Account },
      CreateGameRoomRoute,
      // { path: '/game-room/:id', /*, name: GameRoom*/ component: CreateGameRoom },
      { path: '/404', component: NotFoundError },
      { path: '*', redirect: '/404' }
    ]
  })