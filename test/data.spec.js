const { returnAbsolutePath } = require('../data.js')
const path = require('path');

describe('test for function returnAbsolutePath()', ()=>{

  it('should be a function', ()=>{
    expect(typeof returnAbsolutePath).toBe('function')
  })

  it('Should throw an error if the parameter is different from a string',()=>{
    input = 123;
    expect(()=>returnAbsolutePath(input)).toThrowError('El input debe ser un string')
  })

  it('should return an string', ()=>{
    const input = '../carpeta_prueba/archivo.md'
    const output = returnAbsolutePath(input)
    expect(typeof output).toBe('string')
  })

  it('should return an absolute path', ()=>{
    const input = '../carpeta_prueba/archivo.md';
    const output = path.resolve(input)
    expect(returnAbsolutePath(input)).toBe(output)
  })

})

  // it('should throw an error if the path entered doesnt exist', ()=>{
  //   const invalidPath = '../carpeta_prueba/noexiste.md'
  //   expect(()=>returnAbsolutePath(invalidPath)).toThrowError('La ruta ingresada no existe')
  // })