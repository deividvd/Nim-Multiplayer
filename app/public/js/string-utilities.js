function stringUtilitiesOf(string) {
  return {
    isStringType
  }

  function isStringType() {
    if (string) { // check: undefined + null
      if (string.constructor === String) { // (typeof string) === "string"
        return true
      }
    }
    return false
  }
}