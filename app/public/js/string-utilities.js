const StringUtilities = Object.freeze( function(string) {
  return {
    doesExist
  }

  function doesExist() {
    if (string) { // check: undefined + null
      if (string.constructor === String) { // if ((typeof object) === "string")
        return true
      }
    }
    return false
  }
})