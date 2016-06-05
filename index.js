'use strict';

const Hapi = require('hapi');
const SocketIO = require('socket.io');
const Inert = require('inert');
const Blankie = require('blankie');
const Scooter = require('scooter');
const nconf = require('nconf');
const ngrok = require('ngrok');

const sockets = require('./sockets');

nconf.argv().env().file({ file: 'config.json' });

const server = new Hapi.Server();

let io;

server.connection({
  host: nconf.get('domain'),
  port: nconf.get('port')
});

server.register([
  {
    register: Inert
  },
  {
    register: require('vision')
  }
], (err) => {
  if (err) {
    console.log(err);
  }

  server.views({
    engines: {
      pug: require('pug')
    },
    isCached: process.env.node === 'production',
    path: __dirname + '/views',
    compileOptions: {
      pretty: true
    }
  });
});

server.register([Scooter,
  {
    register: Blankie,
    options: {
      defaultSrc: 'self',
      connectSrc: ['ws:', 'wss:', 'self'],
      imgSrc: ['self', 'data:'],
      scriptSrc: 'self',
      styleSrc: 'self',
      fontSrc: 'self',
      generateNonces: false
    }
  }
], (err) => {
  if (err) {
    throw err;
  }
});

let home = function (request, reply) {
  reply.view('index');
};

const routes = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: home
    }
  }
];

server.route(routes);

server.route({
  path: '/{p*}',
  method: 'GET',
  handler: {
    directory: {
      path: ['./build', './assets/css', './assets/fonts'],
      listing: false,
      index: false
    }
  }
});

server.start((err) => {
  if (err) {
    throw err.msg;
  }

  io = SocketIO.listen(server.listener);

  io.on('connection', (socket) => {
    sockets.actions(io, socket);
  });
});
