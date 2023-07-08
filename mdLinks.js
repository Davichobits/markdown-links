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


const mdLinks = (userPath) => {
  return new Promise((resolve, reject) => {

    // Comprobar que se haya pasado una ruta
    if (!userPath) {
      reject(new Error('El path no fue proporcionado.'));
    }

    //Comprobar si la ruta ingresada es relativa o absoluta
    const userPathAbsolute = path.resolve(userPath);
    
    fsPromises.access(userPathAbsolute) // se resuelve si se puede acceder al archivo o directorio y se rechaza en caso de que no.
    .then(result => fs.promises.stat(userPathAbsolute)) 
    .then(stats => {
      if (stats.isFile()) {

        if(path.extname(userPathAbsolute) !== '.md'){
          reject(new Error('El archivo no es markdown'))
        }

        // Leer el contenido del archivo
        fs.readFile(userPathAbsolute, 'utf8', (err, data) => {
          const html = marked.parse(data);
          const dom = new JSDOM(html)
          const linksDom = [...dom.window.document.getElementsByTagName("a")]
          const links = []
          linksDom.forEach(item => {
            const newLink = new LinkObject(item.textContent, item.href, userPath)
            links.push(newLink)
          })
          resolve(links)
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