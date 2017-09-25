'use strict';

const url = require('url');
const queryString = require('querystring');

// The request parser module should return a promise
// that parses the request url, querystring,
// and POST or PUT body (as JSON).
module.exports = (req) => {
  return new Promise((resolve, reject) => {
    req.url = url.parse(req.url);
    req.url.query = queryString.parse(req.url.query);

    if(!(req.method === 'POST' || req.method === 'PUT'))
      return resolve(req);

    let text = '';

    req.on('data', (buffer) => {
      text += buffer.toString();
    });
    req.on('end', () => {
      try {
        req.body = JSON.parse(text);
        resolve(req);
      } catch (err) {
        reject(err);
      }
    });
  });
};
