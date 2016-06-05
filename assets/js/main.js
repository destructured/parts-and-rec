'use strict';

const ws = require('./ws');
const rtc = require('./rtc');

const socket = ws.getSocket();

let info = document.querySelector('#info');

socket.on('connect', () => {
  socket.emit('join');
});

socket.on('error', () => {
  let p = document.createElement('p');
  p.className = 'error';
  p.textContent = url;
  info.appendChild(p);
});

socket.on('registered', (url) => {
  if (!url || (url && !url.match(/^http(s)?:\/\/\w{1,}\.ngrok\.io$/i))) {
    console.log('invalid url');
    return;
  }

  let a = document.createElement('a');
  a.textContent = a.href = url;
  info.appendChild(a);
  setTimeout(() => {
    info.removeChild(a);
  }, 5000);
});