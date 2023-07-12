const { mdLinks } = require('./mdLinks.js')

mdLinks('./carpeta_prueba/carpeta_con_archivos_md', false)
.then(result => console.log('index:', result))
.catch(error => console.log(error.message))


