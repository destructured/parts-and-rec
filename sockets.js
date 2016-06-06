'use strict';

const nconf = require('nconf');
const ngrok = require('ngrok');
const level = require('level');

nconf.argv().env().file({ file: 'config.json' });

const db = level(nconf.get('db'), {
  createIfMissing: true,
  valueEncoding: 'json'
});

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

function addConnection(data, socket) {
  db.get('connections', (err, c) => {
    if (err || !c) {
      c = {};
    }

    c[data] = {
      url: data
    };

    db.put('connections', c, (err) => {
      if (err) {
        console.log(err);
        return socket.emit('error', 'Could not add this ngrok URL as a connection.');
      }

      socket.emit('info', 'Successfully added ngrok URL as a connection.');
      socket.emit('connector.list', c);
    });
  });
}

exports.actions = function (io, socket) {
  socket.on('join', (data) => {
    console.log('joined ', ngrokURL);

    io.sockets.emit('registered', ngrokURL);
  });

  socket.on('connector.list', () => {
    db.get('connections', (err, c) => {
      if (!err) {
        socket.emit('connector.list', c);
      }
    });
  });

  socket.on('connector.add', (data) => {
    console.log('adding connection url: ', data);

    if (data.match(/^http(s)?:\/\/\w{1,}\.ngrok\.io\/$/i)) {
      data = data.substring(0, data.length - 1);
    }

    if (!data.match(/^http(s)?:\/\/\w{1,}\.ngrok\.io$/i)) {
      return;
    }

    addConnection(data, socket);
  });
};