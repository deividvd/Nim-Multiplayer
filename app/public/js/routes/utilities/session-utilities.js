const getUserLoggedInPath = serverAddress + 'get-user-logged-in'

function sessionUtilities() {
  return {
    setUsernameOf,
    promiseSetUsernameOf,
    goHomeIfUserIsLoggedIn,
    goHomeIfUserIsLoggedOut,
  }

  function setUsernameOf(vueComponent) {
    axios.get(getUserLoggedInPath)
      .then((response) => { vueComponent.username = response.data.username })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function promiseSetUsernameOf(vueComponent) {
    return axios.get(getUserLoggedInPath)
      .then(response => { vueComponent.username = response.data.username })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function goHomeIfUserIsLoggedIn(vueComponent) {
    axios.get(getUserLoggedInPath)
      .then((response) => {
        if (response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function goHomeIfUserIsLoggedOut(vueComponent) {
    axios.get(getUserLoggedInPath)
      .then((response) => {
        if ( ! response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
      .catch((error) => { vueComponent.errorMessage = error })
  }
}