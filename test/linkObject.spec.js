const { LinkObject } = require('../utils/linkObject')
const axios = require('axios');

jest.mock('axios');

describe('LinkObject', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set status and statusText when the request is successful', () => {
    const link = new LinkObject('Google', 'https://www.google.com', 'example.md');
    const response = {
      status: 200,
      statusText: 'OK'
    };
    axios.get.mockResolvedValue(response);

    return link.validate()
      .then(() => {
        expect(link.status).toBe(200);
        expect(link.statusText).toBe('OK');
      });
  });

  it('should set status and statusText when the request fails with a response', () => {
    const link = new LinkObject('Invalid Link', 'https://www.example.com', 'example.md');
    const response = {
      status: 404,
      statusText: 'Not Found'
    };
    axios.get.mockRejectedValue({ response });

    return link.validate()
      .then(() => {
        expect(link.status).toBe(404);
        expect(link.statusText).toBe('Not Found');
      });
  });

  it('should set status and statusText when the request fails without a response', () => {
    const link = new LinkObject('Invalid Link', 'https://www.example.com', 'example.md');
    axios.get.mockRejectedValue(new Error('Network Error'));

    return link.validate()
      .then(() => {
        expect(link.status).toBe(404);
        expect(link.statusText).toBe('FAIL');
      });
  });
});