function sessionUtilities() {
  return {
    setUsernameOf,
    goHomeIfUserIsLoggedIn,
    goHomeIfUserIsLoggedOut
  }

  function setUsernameOf(vueComponent) {
    axios.get(serverAddress + 'get-user-logged-in')
      .then((response) => { vueComponent.username = response.data.username })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function goHomeIfUserIsLoggedIn(vueComponent) {
    axios.get(serverAddress + 'get-user-logged-in')
      .then((response) => {
        if (response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
      .catch((error) => { vueComponent.errorMessage = error })
  }

  function goHomeIfUserIsLoggedOut(vueComponent) {
    axios.get(serverAddress + 'get-user-logged-in')
      .then((response) => {
        if (! response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
      .catch((error) => { vueComponent.errorMessage = error })
  }

}