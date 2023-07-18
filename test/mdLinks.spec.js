const { mdLinks } = require('../mdLinks.js');

describe('test for function mdLinks', () => {

  it('should to throw an error if the path doesn.t exist', () => {
    expect(()=>mdLinks()).rejects.toThrow('El path no fue proporcionado.')
  });
  
  it('should resolve a promise with a defined value', ()=>{
    const userPath = './carpeta_prueba/archivo.md' 
    mdLinks(userPath).then(data => {
      expect(data).toBeDefined();
    })
  })
  
  it('should resolve a promise with a defined value', ()=>{
    const userPath = './carpeta_prueba/archivo.md' 
    expect(mdLinks(userPath)).resolves.toBeDefined();
  })
  
  it('should reject an error if the path is incorrect', ()=>{
    const invalidPath = './carpeta_prueba/ruta-invalida.md'
    expect(mdLinks(invalidPath)).rejects.toThrow('La ruta ingresada no existe')
  })

  it('should reject an error if the path is not a md file', ()=>{
    const htmlPath = './carpeta_prueba/texto.html';
    expect(mdLinks(htmlPath)).rejects.toThrow('El archivo no es markdown')
  })

  it('should return an array of objects if the file is valid', ()=>{
    const userPath = './carpeta_prueba/archivo.md' 
    const output = [
      {
        text: 'google',
        url: 'https://www.google.com/',
        file: './carpeta_prueba/archivo.md'
      },
      {
        text: 'youtube',
        url: 'https://www.youtube.com/CodingTube',
        file: './carpeta_prueba/archivo.md'
      },
      {
        text: "nose",
        url: "https://esto-no-existe.com/no-existe",
        file: "./carpeta_prueba/archivo.md",
      },
    ]
    expect(mdLinks(userPath)).resolves.toEqual(output);
  })

  test('debería lanzar un error cuando el segundo parámetro no es un booleano', () => {
    const userPath = './carpeta_prueba/archivo.md' 
    return expect(mdLinks(userPath, 12)).rejects.toThrow('El segundo parametro debe ser un boleano');
  });

  it('should return and arrays of objects with validate links, when the second parameter si true', ()=>{
    const userPath = '../carpeta_prueba/archivo.md' 
    const second_parameter = true;
    const output = [
      {
        text: 'google',
        url: 'https://www.google.com/',
        file: './carpeta_prueba/archivo.md',
        status: 200,
        statusText: 'OK'
      },
      {
        text: 'youtube',
        url: 'https://www.youtube.com/CodingTube',
        file: './carpeta_prueba/archivo.md',
        status: 200,
        statusText: 'OK'
      },
      {
        text: "nose",
        url: "https://esto-no-existe.com/no-existe",
        file: "./carpeta_prueba/archivo.md",
        status: 404,
        statusText: 'FAIL'
      },
    ]
    expect(mdLinks(userPath, second_parameter)).resolves.toEqual(output);
  })

  // it('should reject an error if the folder is empty', ()=>{
  //   userPath = '../carpeta_prueba/carpeta_vacia';
  //   return expect(mdLinks(userPath)).rejects.toThrow('La carpeta no contiene archivos markdown');
  // })

});



