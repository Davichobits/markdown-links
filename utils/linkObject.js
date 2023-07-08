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
        this.ok = response.statusText;
      })
      .catch((error) => {
        this.status = error.response.status;
        this.ok = error.response.statusText;
      });
  }
}

module.exports = {
  LinkObject
}