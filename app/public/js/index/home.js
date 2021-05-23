const Home = {
  components: {
    'mainHeader': MainHeader,
    'loginSection': LoginSection,
    'howToPlay': HowToPlay,
    'informativeLinks': InformativeLinks
  },
  template:
    `
    <div>

      <mainHeader/>

      <section>
        <button onclick="window.location.href='https://localhost:3000/game-room'">
          CREATE GAME ROOM
        </button>
      </section>

      <loginSection/>

      <howToPlay/>

      <informativeLinks/>

    </div>
    `,
  methods: {
    createGameRoom: function(event) {
      console.log(axios.get("http://localhost:3000/game-room"))
    }
  }
}
