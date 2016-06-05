'use strict';

const nconf = require('nconf');
const ngrok = require('ngrok');

nconf.argv().env().file({ file: 'config.json' });

const token = nconf.get('ngrokToken') || false;
const subdomain = nconf.get('subdomain') || false;

let ngrokURL;

let opts = {
  addr: nconf.get('port')
};

if (token) {
  opts.authtoken = token;
}

if (subdomain) {
  opts.subdomain = subdomain;
}

function setOnline() {
  ngrok.connect(opts, (err, url) => {
    if (err) {
      console.log(err);
      if (err.error_code === 103) {
        return;
      }

      ngrok.kill();
      setOnline();
    }

    ngrokURL = url;
  });
}

setOnline();

exports.actions = function (io, socket) {
  socket.on('join', (data) => {
    console.log('joined ', ngrokURL);

    io.sockets.emit('registered', ngrokURL);
  });
};