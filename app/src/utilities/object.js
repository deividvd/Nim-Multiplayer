module.exports = function(object) {
  return {
    isObjectType
  }

  function isObjectType() {
    if (object) { // check: undefined + null
      if (object.constructor === Object) { // (typeof object) === "object"
        return true
      }
    }
    return false
  }
}