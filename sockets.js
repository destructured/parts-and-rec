'use strict';

const nconf = require('nconf');
const ngrok = require('ngrok');

nconf.argv().env().file({ file: 'config.json' });

let ngrokURL;

exports.actions = function (io, socket) {
  socket.on('join', (data) => {
    console.log('joined');
  });

  socket.on('register', (data) => {
    ngrok.kill();
    ngrok.connect(nconf.get('port'), (err, url) => {
      if (err) {
        return console.log(err);
      }

      ngrokURL = url;
      io.sockets.emit('registered', ngrokURL);
    });
  });
};