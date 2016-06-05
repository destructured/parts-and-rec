'use strict';

const ws = require('./ws');

const socket = ws.getSocket();

socket.on('connect', () => {
  socket.emit('join');
});