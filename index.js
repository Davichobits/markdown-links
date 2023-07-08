const { mdLinks } = require('./mdLinks.js')

mdLinks('./carpeta_prueba/archivo.md')
.then(result => console.log(result))
.catch(error => console.log(error.message))