const path = require('path');
const fs = require('fs');
const fsPromises = require('fs/promises');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { LinkObject } = require('./utils/linkObject')

const marked = require('marked');
const renderer = new marked.Renderer();

const options = {
  mangle: false,
  headerIds: false
};

marked.setOptions({
  renderer,
  ...options
});


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

            // --------------------------
            const links = []
            if (validate) {
              createValidatedLinksObjectsArray(linksDom, userPath, resolve, reject)
            } else {
              resolve(createLinkObjectsArray(linksDom, userPath))
            }
            // --------------------------

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

          const allLinks = []
          const linksPromises = absolutesRoutesMdFiles.map(absolutesRoutes => {
            return new Promise((resolve, reject) => {
              //lectura contenido del archivo
              fs.readFile(absolutesRoutes, 'utf8', (err, documentContent) => {
                const linksDom = extractLinksFromDocumentContent(documentContent)

                // --------------------------
                
                if (validate) {
                  createValidatedLinksObjectsArray(linksDom, userPath, resolve, reject)
                } else {
                  resolve(createLinkObjectsArray(linksDom, userPath))
                }
                // --------------------------
              })
            })
          })
          Promise.all(linksPromises)
            .then(validatedLinks => {
              allLinks.push(...validatedLinks);
              resolve(allLinks)
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


function extractLinksFromDocumentContent(documentContent){
  const html = marked.parse(documentContent);
  const dom = new JSDOM(html)
  return linksDom = [...dom.window.document.getElementsByTagName("a")]
}

/***
 * Return an array of objects created with the class LinkObject
 * @param {array} linksDom - Array of links from DOM
 * @param {string} filePath - Path of the arrays of links
 */
function createLinkObjectsArray(linksDom, filePath){
  const linkObjects = []
  linksDom.forEach((item) => {
    const newLink = new LinkObject(item.textContent, item.href, filePath)
    linkObjects.push(newLink)
  })
  return linkObjects
}

/**
 * Return an array of validated links Objects
 * @param {array} linksDom - Array of links from DOM
 * @param {string} filePath - Path of the arrays of links
 * @param {function} resolve - callback to resolve the promise
 * @param {function} reject - callback to reject the promise
 */
function createValidatedLinksObjectsArray(linksDom, filePath, resolve, reject){
  const links = []
  const promises = linksDom.map(item => {
    const newLink = new LinkObject(item.textContent, item.href, filePath);
    return newLink.validate().then(res => newLink);
  });
  Promise.all(promises)
    .then(validatedLinks => {
      links.push(...validatedLinks);
      resolve(links)
      return
    })
    .catch(error => {
      reject(error)
      return
    });
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
