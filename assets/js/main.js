'use strict';

const ws = require('./ws');

const socket = ws.getSocket();

const info = document.querySelector('#info');

socket.on('connect', () => {
  socket.emit('join');
});

socket.on('registered', (url) => {
  let p = document.createElement('p');
  p.textContent = url;
  info.appendChild(p);
});

socket.emit('register');