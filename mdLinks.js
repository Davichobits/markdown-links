const { returnAbsolutePath } = require('./data.js')

const mdLinks = (userPath) => {
  return new Promise((resolve, reject) => {

    // Comprobar que se haya pasado una ruta
    if (!userPath) {
      reject(new Error('El path no fue proporcionado.'));
    }

    // Comprobar si la ruta ingresada es relativa o absoluta
    // let userPathAbsolute = returnAbsolutePath(userPath);

    resolve([])
  })
}
module.exports = {
  mdLinks
}