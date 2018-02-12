'use strict';

const Hapi = require('hapi');
const fs = require('fs');
const path = require('path');

const server = Hapi.server({
  host: 'localhost',
  port: 8000,
  routes: {
    cors: true
  }
});

const readFileAsync = (filename) => {
  return new Promise((resolve, reject) => {
    let result = [];
    fs.readFile(filename, 'utf8', (err, data) => {
      if(err) {
        reject(err);
      }
      const ipAddresses = data.split('\n');
      result = ipAddresses.reduce((acc, el) => {
        for(let i = 0; i < acc.length; i++) {
          if (el === acc[i]) {
            return acc;
          }
        }
        acc.push(el);
        return acc;
      }, []);
      resolve(result);
    });
  })
}

server.route({
  method: 'GET',
  path:'/ips',
  handler: function (req, res) {
    return readFileAsync('test.txt');
  }
});

async function start() {

  try {
    await server.start();
  }
  catch (err) {
    console.log(err);
    process.exit(1);
  }

  console.log('Server running at:', server.info.uri);
};

start();