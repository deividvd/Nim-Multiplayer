const getUserLoggedInPath = serverAddress + 'get-user-logged-in'

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
function sessionUtilitiesOf(vueComponent) {
  return {
    setUsername,
    promiseSetUsername,
    goHomeIfUserIsLoggedIn,
    goHomeIfUserIsLoggedOut,
  }

  function setUsername() {
    axios.get(getUserLoggedInPath)
      .then((response) => { vueComponent.username = response.data.username })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function promiseSetUsername() {
    return axios.get(getUserLoggedInPath)
      .then(response => { vueComponent.username = response.data.username })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function goHomeIfUserIsLoggedIn() {
    axios.get(getUserLoggedInPath)
      .then((response) => {
        if (response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function goHomeIfUserIsLoggedOut() {
    axios.get(getUserLoggedInPath)
      .then((response) => {
        if ( ! response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
      .catch((error) => { vueComponent.errorMessage = error })
  }
}