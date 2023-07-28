const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const { LinkObject } = require('./linkObject')

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

/**
 * Return an array of links extracted from a content of an document
 * @param {string} documentContent - Content from a document markdown
 */
const extractLinksFromDocumentContent = (documentContent) => {
  if(typeof documentContent !== 'string'){
    throw new Error('Parametro ingresado incorrecto')
  }
  const html = marked.parse(documentContent);
  const dom = new JSDOM(html)
  const linksDom = [...dom.window.document.getElementsByTagName("a")]
  return linksDom
}

/***
 * Return an array of objects created with the class LinkObject
 * @param {array} linksDom - Array of links from DOM
 * @param {string} filePath - Path of the arrays of links
 */
const createLinkObjectsArray = (linksDom, filePath) => {
  const linkObjects = []
  linksDom.forEach((item) => {
    const newLink = new LinkObject(item.textContent, item.href, filePath)
    linkObjects.push(newLink)
  })
  return linkObjects
}

/**
 * Return an array of validated links Objects
 * @param {array} linksDom - Array of links from DOM
 * @param {string} filePath - Path of the arrays of links
 * @param {function} resolve - callback to resolve the promise
 * @param {function} reject - callback to reject the promise
 */
const createValidatedLinksObjectsArray = (linksDom, filePath, resolve, reject) => {
  let links = []
  const promises = linksDom.map(item => {
    const newLink = new LinkObject(item.textContent, item.href, filePath);
    return newLink.validate().then(res => newLink);
  });
  Promise.all(promises)
    .then(validatedLinks => {
      links = [...links, ...validatedLinks];
      resolve(links)
      return
    })
    .catch(error => {
      reject(error)
      return
    });
}

module.exports = {
  extractLinksFromDocumentContent,
  createLinkObjectsArray,
  createValidatedLinksObjectsArray
}