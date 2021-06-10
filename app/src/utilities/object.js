module.exports = function(object) {
  return {
    doesExist
  }

  function doesExist() {
    if (object) { // check: undefined + null
      if (object.constructor === Object) { // if ((typeof object) === "object")
        return true
      }
    }
    return false
  }
}