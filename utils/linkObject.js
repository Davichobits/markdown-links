const axios = require('axios');

class LinkObject {
  constructor(text, url, file) {
    this.text = text;
    this.url = url;
    this.file = file;
  }

  validate() {
    return axios.get(this.url)
      .then((response) => {
        this.status = response.status;
        this.statusText = response.statusText;
      })
      .catch((error) => {
        if (error.response) {
          this.status = error.response.status;
          this.statusText = error.response.statusText;
        } else {
          this.status = 404;
          this.statusText = 'FAIL';
        }
      });
  }
}

module.exports = {
  LinkObject
}