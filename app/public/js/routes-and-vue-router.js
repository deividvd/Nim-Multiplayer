const serverAddress = 'https://192.168.1.95:3000/'

const HomeRoute = {
  path: '/',
  name: 'Home',
  component: Home
}

// user data routes

const RegisterRoute = {
  path: '/register',
  name: 'Register',
  component: Register
}
const LoginRoute = {
  path: '/login',
  name: 'Login',
  component: Login
}
const AccountRoute = {
  path: '/account',
  name: 'Account',
  component: Account
}

// game routes

const CreateGameRoomRoute = {
  path: '/create-game-room',
  name: 'CreateGameRoom',
  component: CreateGameRoom
}
const gameRoomPath = '/game-room'
const GameRoomRoute = {
  path: gameRoomPath + '/:id',
  name: 'GameRoom',
  component: GameRoom
}

const router = new VueRouter({
  mode: 'history',
  routes: [
    HomeRoute,
    // policy routes
    { path: '/privacy', component: Privacy },
    { path: '/terms-of-service', component: TermsOfService },
    // user data routes
    RegisterRoute,
    LoginRoute,
    AccountRoute,
    // game routes
    CreateGameRoomRoute,
    GameRoomRoute,
    // 404
    { path: '/404', component: NotFoundError },
    { path: '*', redirect: '/404' }
  ]
})