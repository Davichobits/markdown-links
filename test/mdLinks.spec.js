const { mdLinks } = require('../mdLinks.js');
const path = require('path')

describe('test for function mdLinks', () => {

  it('should to throw an error if the path doesn.t exist', () => {
    expect(()=>mdLinks()).rejects.toThrow('El path no fue proporcionado.')
  });
  
  it('should resolve a promise with a defined value', ()=>{
    const userPath = '../carpeta_prueba/archivo.md' 
    mdLinks(userPath).then(data => {
      expect(data).toBeDefined();
    })
  })
  
  it('should resolve a promise with a defined value', ()=>{
    const userPath = '../carpeta_prueba/archivo.md' 
    expect(mdLinks(userPath)).resolves.toBeDefined();
  })
  
  it('should resolve a promise with an array', ()=>{
    expect(mdLinks('../carpeta_prueba/archivo.md')).resolves.toEqual([])
  })


  it('should reject an error if the path is incorrect', ()=>{
    const invalidPath = '../carpeta_prueba/ruta-invalida.md'
    expect(mdLinks(invalidPath)).rejects.toThrow('La ruta ingresada no existe')
  })

  it('should reject an error if the path is not a md file', ()=>{
    const htmlPath = '../carpeta_prueba/texto.html';
    expect(mdLinks(htmlPath)).rejects.toThrow('El archivo no es markdown')
  })

});



