const path = require('path');

const returnAbsolutePath = (userPath) => {
  if (!path.isAbsolute(userPath)) {
    return path.resolve(userPath)
  } else {
    return userPath
  }
}

module.exports = {
  returnAbsolutePath
}