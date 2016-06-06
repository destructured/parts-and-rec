'use strict';

const ws = require('./ws');
const rtc = require('./rtc');
const connections = require('./connections');

const socket = ws.getSocket();

let info = document.querySelector('#info');

socket.on('connect', () => {
  socket.emit('join');
});

socket.on('error', (data) => {
  let p = document.createElement('p');
  p.className = 'error';
  p.textContent = data;
  info.appendChild(p);
  setTimeout(() => {
    info.removeChild(p);
  }, 5000);
});

socket.on('info', (data) => {
  let p = document.createElement('p');
  p.className = 'info';
  p.textContent = data;
  info.appendChild(p);
  setTimeout(() => {
    info.removeChild(p);
  }, 5000);
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
