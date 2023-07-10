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
    }

    const userPathAbsolute = path.resolve(userPath);

    if(validate !== undefined && typeof validate !== "boolean"){
      reject(new Error('El segundo parametro debe ser un boleano'));
    }
    
    fsPromises.access(userPathAbsolute) // se resuelve si se puede acceder al archivo o directorio y se rechaza en caso de que no.
    .then(result => fs.promises.stat(userPathAbsolute)) 
    .then(stats => {
      if (stats.isFile()) {

        if(path.extname(userPathAbsolute) !== '.md'){
          reject(new Error('El archivo no es markdown'))
        }

        // Leer el contenido del archivo
        fs.readFile(userPathAbsolute, 'utf8',  (err, data) => {
          const html = marked.parse(data);
          const dom = new JSDOM(html)
          const linksDom = [...dom.window.document.getElementsByTagName("a")]
          const links = []
          // ----------------

          if (validate) {
            const promises = linksDom.map(item => {
              const newLink = new LinkObject(item.textContent, item.href, userPath);
              return newLink.validate().then(res => newLink);
            });
            
            Promise.all(promises)
              .then(validatedLinks => {
                links.push(...validatedLinks);
                // Continuar con el código después de que todos los enlaces se hayan validado
                resolve(links)
              })
              .catch(error => {
                reject(error)
              });
          } else {
            linksDom.forEach(item => {
              const newLink = new LinkObject(item.textContent, item.href, userPath)
              links.push(newLink)
            })
            resolve(links)
          }
          
          // --------------------------
          
        })
      }
    })
    .catch(error => {
      reject(new Error('La ruta ingresada no existe'))
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