const serverAddress = 'https://192.168.1.95:3000/'

const HomeRoute = {
  path: '/',
  name: 'Home',
  component: Home
}

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

const CreateGameRoomRoute = {
  path: '/create-game-room',
  name: 'CreateGameRoom',
  component: CreateGameRoom
}

const invitePlayersRoomPath = '/invite-players-room'
const InvitePlayersRoomRoute = {
  path: invitePlayersRoomPath + '/:id',
  name: 'WaitPlayersRoom',
  component: InvitePlayersRoom
}

const gameRoomPath = '/game-room'
const GameRoomRoute = {
  path: gameRoomPath + '/:id',
  name: 'GameRoom',
  component: GameRoom
}