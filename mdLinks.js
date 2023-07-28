const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');

const {
  extractLinksFromDocumentContent,
  createLinkObjectsArray,
  createValidatedLinksObjectsArray
} = require('./utils/library.js');

const mdLinks = (userPath, validate) => {
  return new Promise((resolve, reject) => {

    if (!userPath) {
      reject(new Error('El path no fue proporcionado.'));
      return
    }

    const userPathAbsolute = path.resolve(userPath);

    if (validate !== undefined && typeof validate !== "boolean") {
      reject(new Error('El segundo parametro debe ser un boleano'));
      return
    }

    fsPromises.access(userPathAbsolute) // se resuelve si se puede acceder al archivo o directorio y se rechaza en caso de que no.
      .then(result => fs.promises.stat(userPathAbsolute))
      .then(stats => {
        if (stats.isFile()) {
          //Es archivo
          if (path.extname(userPathAbsolute) !== '.md') {
            reject(new Error('El archivo no es markdown'))
            return
          }

          //lectura contenido del archivo
          fs.readFile(userPathAbsolute, 'utf8', (err, documentContent) => {
            const linksDom = extractLinksFromDocumentContent(documentContent)

            if (validate) {
              createValidatedLinksObjectsArray(linksDom, userPath, resolve, reject)
            } else{
              const linksObjectArray = createLinkObjectsArray(linksDom, userPath)
              resolve(linksObjectArray)
            }
            
          })
        } else {
          // En caso de que sea carpeta:
          const allfiles = fs.readdirSync(userPathAbsolute)
          const mdFiles = allfiles.filter(item => item.includes('.md'))

          if (mdFiles.length === 0) {
            reject(new Error('La carpeta no contiene archivos markdown'))
            return
          }

          const absolutesRoutesMdFiles = []
          mdFiles.forEach(mdfile => {
            completeRoute = path.join(userPathAbsolute, mdfile)
            absolutesRoutesMdFiles.push(completeRoute)
          })

          let allLinks = []
          const linksPromises = absolutesRoutesMdFiles.map(absolutesRoutes => {
            return new Promise((resolve, reject) => {
              //lectura contenido del archivo
              fs.readFile(absolutesRoutes, 'utf8', (err, documentContent) => {

                const linksDom = extractLinksFromDocumentContent(documentContent)                

                if (validate) {
                  createValidatedLinksObjectsArray(linksDom, userPath, resolve, reject)
                } else{
                  const linksObjectArray = createLinkObjectsArray(linksDom, userPath)
                  resolve(linksObjectArray)
                }
                
              })
            })
          })
          Promise.all(linksPromises)
          .then(validatedLinks => {

              let newArray = []
              validatedLinks.forEach(array=>{
                newArray = newArray.concat(array)
              })

              resolve(newArray)
              return
            })
            .catch(error => {
              reject(error)
              return
            });

        }
      })
      .catch(error => {
        reject(new Error('La ruta ingresada no existe'))
        return
      })

  })
}

module.exports = {
  mdLinks
}


// ----------------
//  const promises = linksDom.map(item => {
//   const newLink = new LinkObject(item.textContent, item.href, userPath);

//   if (validate) {
//     return newLink.validate().then(res => newLink);
//   } else {
//     return Promise.resolve(newLink);
//   }
// });

// Promise.all(promises)
//   .then(validatedLinks => {
//     links.push(...validatedLinks);
//     // Continuar con el código después de que todos los enlaces se hayan validado
//     resolve(links)
//   })
//   .catch(error => {
//     // Manejar cualquier error que ocurra durante la validación de los enlaces
//   });
// --------------------------
