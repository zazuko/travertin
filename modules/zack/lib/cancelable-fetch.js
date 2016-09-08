function cancelableFetch (fetch) {
  var cancel = false

  var promise = new Promise(function (resolve, reject) {
    fetch.then(function (res) {
      if (cancel) {
        if (res.body && res.body.cancel) {
          res.body.cancel()
        }

        reject(new Error('user cancelation'))
      } else {
        resolve(res)
      }
    })
  })

  promise.cancel = function () {
    cancel = true
  }

  return promise
}

module.exports = cancelableFetch
