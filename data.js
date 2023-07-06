const path = require('path');

const returnAbsolutePath = (userPath) => {

  //Validar el tipo de input
  if(typeof userPath !== 'string'){
    throw new Error("El input debe ser un string")
  }

  if (!path.isAbsolute(userPath)) {
    return path.resolve(userPath)
  } else {
    return userPath
  }
}

module.exports = {
  returnAbsolutePath
}