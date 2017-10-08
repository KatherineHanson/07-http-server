'use strict';

const superagent = require('superagent');

describe('POST /api/cowsay', () => {
  test('should respond with 200 response and echo the body', () => {
    return superagent.post('http://localhost:4000/api/cowsay')
    .send({
      title: 'hello world',
    })
    .then(res => {
      expect(res.status).toEqual(200);
      expect(res.body).toEqual({title: 'hello world'});
    });
  });

  test('should respond with a 400', () => {
    return superagent.post('http://localhost:3000/api/cowsay')
    .set({ 'Content-Type': 'application/json'})
    .send('{')
    .then(Promise.reject)
    .catch(res => {
      expect(res.status).toEqual(400);
      console.log(res);
      expect(res.response.text).toEqual('bad request');
    });
  });
});
