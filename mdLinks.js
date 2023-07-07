const path = require('path')

const mdLinks = (userPath) => {
  return new Promise((resolve, reject) => {

    // Comprobar que se haya pasado una ruta
    if (!userPath) {
      reject(new Error('El path no fue proporcionado.'));
    }

    //Comprobar si la ruta ingresada es relativa o absoluta
    let userPathAbsolute = path.resolve(userPath);
   

    
    resolve([])
  })
}
module.exports = {
  mdLinks
}