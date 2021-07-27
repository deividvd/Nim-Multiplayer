function responseResolverOf(vueComponent) {
  return {
    addSuccessBehavior: function(successBehaviorOf) {
      return {
        resolve
      }

      function resolve(response) {
        if (! response.data.exceptionMessage) {
          successBehaviorOf(vueComponent)
        } else {
          vueComponent.errorMessage = response.data.exceptionMessage
        }
      }
    }
  }
}