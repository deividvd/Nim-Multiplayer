function sessionUtilities() {
  return {
    setUsernameOf,
    goHomeIfUserIsLoggedIn,
    goHomeIfUserIsLoggedOutAndSetUsernameOf
  }

  function setUsernameOf(vueComponent) {
    axios.get("https://localhost:3000/get-user-logged-in")
      .then(response => {
        vueComponent.username = response.data.username
      })
  }

  function goHomeIfUserIsLoggedIn() {
    axios.get("https://localhost:3000/get-user-logged-in")
      .then((response) => {
        if (response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
  }

  function goHomeIfUserIsLoggedOutAndSetUsernameOf(vueComponent) {
    axios.get("https://localhost:3000/get-user-logged-in")
      .then((response) => {
        vueComponent.username = response.data.username
        if (! vueComponent.username) {
          router.push({ name: HomeRoute.name })
        }
      })
  }

}