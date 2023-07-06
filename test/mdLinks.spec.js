const { mdLinks } = require('../mdLinks.js');


describe('test for function mdLinks', () => {

  it('should to throw an error if the path doesn.t exist', () => {
    expect(()=>mdLinks()).rejects.toThrowError('El path no fue proporcionado.')
  });

  it('should resolve a promise with a defined value', ()=>{
    const userPath = '../carpeta_prueba/archivo.md' 
    return mdLinks(userPath).then(data => {
      expect(data).toBeDefined();
    })
  })

  it('should resolve a promise with a defined value', ()=>{
    const userPath = '../carpeta_prueba/archivo.md' 
    expect(mdLinks(userPath)).resolves.toBeDefined();
  })

  it('should resolve a promise with an array', ()=>{
    return expect(mdLinks('../carpeta_prueba/archivo.md')).resolves.toEqual([])
  })

});