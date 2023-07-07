const path = require('path');
const fsPromises = require('fs/promises');

const mdLinks = (userPath) => {
  return new Promise((resolve, reject) => {

    // Comprobar que se haya pasado una ruta
    if (!userPath) {
      reject(new Error('El path no fue proporcionado.'));
    }

    //Comprobar si la ruta ingresada es relativa o absoluta
    const userPathAbsolute = path.resolve(userPath);
    
    fsPromises.access(userPathAbsolute) // se resuelve si se puede acceder al archivo o directorio y se rechaza en caso de que no.
    .then(result => {
      resolve([]);
    })
    .catch(error => {
      reject(new Error(`La ruta ${error.path} no existe`))
    })

  })
}
module.exports = {
  mdLinks
}