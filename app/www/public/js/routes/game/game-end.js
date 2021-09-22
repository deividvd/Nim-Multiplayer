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
        <p> WINNER: {{ this.$route.params.winner }} </p>

        <label> LOSERS: </label>
        <ul v-for="player in this.$route.params.losers">
          {{ player }}
        </ul>
      </section>
    </main>

  </div>
  `,
}
