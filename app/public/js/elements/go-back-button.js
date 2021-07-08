const GoBackButton = {
  template:
  `
  <button v-on:click="goBack" type="button"> GO BACK </button>
  `,
  methods: {
    goBack: function() {
      twoPageRoutingFrom(this).addParameters({}).backToPrevious()
    }
  }
}