function sessionUtilities() {
  return {
    setUsernameOf,
    goHomeIfUserIsLoggedIn,
    goHomeIfUserIsLoggedOut
  }

  function setUsernameOf(vueComponent) {
    axios.get(serverAddress + 'get-user-logged-in')
      .then(response => {
        vueComponent.username = response.data.username
      })
  }

  function goHomeIfUserIsLoggedIn() {
    axios.get(serverAddress + 'get-user-logged-in')
      .then((response) => {
        if (response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
  }

  function goHomeIfUserIsLoggedOut() {
    axios.get(serverAddress + 'get-user-logged-in')
      .then((response) => {
        if (! response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
  }

}