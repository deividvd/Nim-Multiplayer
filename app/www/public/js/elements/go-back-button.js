const GoBackButton = {
  template:
  `
  <button id="go-back-button" v-on:click="goBack" type="button">
    <img src="/static/img/go-back.png" alt="go back button" />
  </button>
  `,
  methods: {
    goBack: function() {
      twoPageRoutingFrom(this).addParameters({}).backToPrevious()
    }
  }
}