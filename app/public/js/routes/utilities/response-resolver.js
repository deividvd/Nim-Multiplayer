function responseResolverOf(vueComponent) {
  return {
    addSuccessBehavior: function(successBehaviorOf) {
      return {
        resolve
      }

      function resolve(response) {
        const exceptionMessage = response.data.exceptionMessage
        if (! exceptionMessage) {
          successBehaviorOf(vueComponent)
        } else {
          vueComponent.errorMessage = exceptionMessage
        }
      }
    }
  }
}