function sessionRouting() {
  return {
    goHomeIfUserIsLoggedIn,
    goHomeIfUserIsLoggedOut
  }

  function goHomeIfUserIsLoggedIn() {
    axios.get("https://localhost:3000/get-user-logged-in")
      .then((response) => {
        if (response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
  }

  function goHomeIfUserIsLoggedOut() {
    axios.get("https://localhost:3000/get-user-logged-in")
      .then((response) => {
        if (! response.data.username) {
          router.push({ name: HomeRoute.name })
        }
      })
  }
}
