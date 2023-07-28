const { mdLinks } = require('./mdLinks.js')

mdLinks('./carpeta_prueba/archivo.md', false)
.then(result => console.log('index:', result))
.catch(error => console.log(error.message))


