'use strict';

// HTTP SERVER defining all route behavior and exporting an interface
// for starting and stopping the server
// It should export an object with start and stop methods

// node dependencies
const http = require('http');
const requestParser = require('./request-parser.js');
const cowsay = require('cowsay');

// functionality
const app = http.createServer((req, res) => {

  requestParser(req)
  .then(req => {
    // route-handling

    // When a client makes a GET request to /
    // the server should send back html with a project description
    // and an anchor to /cowsay.
    if(req.method === 'GET' && req.url.pathname === '/'){
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(`<!DOCTYPE html>
      <html>
        <head>
          <title> cowsay </title>
        </head>
        <body>
          <header>
            <nav>
              <ul>
              <li><a href="/cowsay">cowsay</a></li>
              </ul>
            </nav>
          <header>
          <main>
            <ul>
              <li>Click the cowsay link to get the cow's default message.</li>
              <li>If you want the cow to say anything else, add "?text="
              followed by your message to the end of the URL and refresh.</li>
            </ul>
          </main>
        </body>
      </html>`);
      res.end();
      return;
    }

    // When a client makes a GET request to /cowsay?text={message}
    // the server should parse the querystring for a text key.
    // It should then send a rendered HTML page with a cowsay cow
    // speaking the value of the text query.
    // If there is no text query, the cow message should say
    // 'I need something good to say!'.
    if(req.method === 'GET' && req.url.pathname === '/cowsay'){
      let output;
      if (req.url.query.text)
        output = req.url.query.text;
      else
        output = 'I need something good to say!';

      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(`<!DOCTYPE html>
      <html>
        <head>
          <title> cowsay </title>
        </head>
        <body>
          <h1> cowsay </h1>
          <pre>
            ${cowsay.say({text: output})}
          </pre>
        </body>
      </html>`);
      res.end();
      return;
    }

    // When a client makes a POST request to /api/cowsay
    // it should send JSON that includes {"text": "<message>"}.
    // The server should respond with a JSON body {"content": "<cowsay cow>"}.
    if(req.method === 'POST' && req.url.pathname === '/api/cowsay'){
      res.writeHead(200, {'Content-Type': 'application/json'});
      res.write(JSON.stringify(req.body));
      res.end();
      return;
    }

    // for a non-route
    res.writeHead(404, {
      'Content-Type': 'text/plain',
    });
    res.write(`resource ${req.url.pathname} not found!`);
    res.end();
  })
  .catch(err => {
    console.log(err);
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.write('bad request');
    res.end();
  });
});

// export interface
module.exports = {
  start: (port, callback) => app.listen(port, callback),
  stop: (callback) => app.close(callback),
};
