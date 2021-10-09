const GameEnd = {
  components: {
    'app-header': AppHeader,
  },
  template:
  `
  <div>

    <app-header/>

    <main>
      <section>
        <p> <b>WINNER</b>: {{ this.$route.params.winner }} </p>

        <label> <b>LOSERS</b>: </label>
        <ul v-for="player in this.$route.params.losers">
          {{ player }}
        </ul>
      </section>
    </main>

  </div>
  `,
  mounted() {
    if (! (this.$route.params.winner && this.$route.params.losers)) {
      router.push({ name: HomeRoute.name })
    }
  },
}
