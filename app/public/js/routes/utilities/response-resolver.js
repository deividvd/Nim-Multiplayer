function responseResolverOf(vueComponent) {
  return {
    addSuccessBehavior: function(successBehaviorOf) {
      return {
        resolve
      }

      function resolve(response) {
        if (response.data.success === 'success') {
          successBehaviorOf(vueComponent)
        } else {
          errorBehaviour()
        }

        function errorBehaviour() {
          if (response.data.exceptionMessage) {
            vueComponent.errorMessage = response.data.exceptionMessage
          } else {
            vueComponent.errorMessage = 'Internal Server Error: unknown.'
          }
        }
      }
    }
  }
}