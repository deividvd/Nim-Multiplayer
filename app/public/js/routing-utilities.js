/**
 * This object is an utility for routing between two pages.
 * 
 * It uses the route parameters to save: the previous route name
 * and some custom data (probably these are inputs entered by the user).
 * 
 * The route parameters are not inserted in the route path (URL),
 * in this way the URL is short and clean.
 * 
 * Drawback: (obviously, since the parameters are not inserted in the URL)
 * if the user reload the (route) page, the parameters are lost,
 * then this object will route to Home instead of the previous page.
 */
function routingUtilities(vueComponent) {
  return {
    addParameters: function(dataObject) {
      return {
        goTo,
        backToPreviousRoute
      }

      function goTo(destinationRoute) {
        const router = vueComponent.$parent.$router
        router.push({
          name: destinationRoute.name,
          params: {
            previousRouteName: vueComponent.$route.name,
            data: dataObject
          }
        })
      }

      function backToPreviousRoute() {
        const previousRouteName = vueComponent.$route.params.previousRouteName
        if (stringUtilities(previousRouteName).doesExist()) {
          switch (previousRouteName) {
            case createGameRoomRoute.name:
              backTo(createGameRoomRoute.name)
              break
            default:
              backTo(homeRoute)
          }
        } else {
          backTo(homeRoute)
        }

        function backTo(previousRouteName) {
          const router = vueComponent.$parent.$router
          router.push({
            name: previousRouteName,
            params: dataObject
          })
        }
      }
    }
  }
}
