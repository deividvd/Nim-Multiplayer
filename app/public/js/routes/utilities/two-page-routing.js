/**
 * This object is an utility for routing between two pages.
 * 
 * It uses the route parameters to save: the previous route name
 * and some custom data inside an object.
 * 
 * The route parameters are not inserted in the route path (URL),
 * in this way the URL is short and clean.
 * 
 * Drawback: (obviously, since the parameters are not inserted in the URL)
 * if the user reload the (route) page, the parameters are lost,
 * then this object will route to Home instead of the previous page.
 */
function twoPageRoutingFrom(vueComponent) {
  return {
    addParameters: function(customData) {
      return {
        goTo,
        backToPrevious
      }

      function goTo(destinationRoute) {
        router.push({
          name: destinationRoute.name,
          params: {
            previousRouteName: vueComponent.$route.name,
            data: customData
          }
        })
      }

      function backToPrevious() {
        const previousRouteName = vueComponent.$route.params.previousRouteName
        switch (previousRouteName) {
          case CreateGameRoomRoute.name:
            backTo(CreateGameRoomRoute.name)
            break
          default:
            backTo(HomeRoute.name)
        }

        function backTo(previousRouteName) {
          router.push({
            name: previousRouteName,
            params: customData
          })
        }
      }
    }
  }
}
