const {
  extractLinksFromDocumentContent,
  createLinkObjectsArray,
  createValidatedLinksObjectsArray
} = require('../utils/library.js');

describe('test for the function extractLinksFromDocumentContent', ()=>{
  it('should be a function', ()=>{
    expect(typeof extractLinksFromDocumentContent).toBe('function')
  })
  it('should throw an error if the param is different from an string', () => {
    const documentContent = 1;
    expect(()=>extractLinksFromDocumentContent(documentContent)).toThrow('Parametro ingresado incorrecto')
  })
  it('should return an array', ()=>{
    const result = extractLinksFromDocumentContent('Documento HTML')
    expect(result).toBeInstanceOf(Array);
  })
})