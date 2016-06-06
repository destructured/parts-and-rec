'use strict';

const ws = require('./ws');

const socket = ws.getSocket();

const connections = document.querySelector('#connections');
const connector = document.querySelector('#connector');
const connectorBtn = document.querySelector('#connector-btn');

socket.emit('connector.list');

connectorBtn.onclick = function () {
  console.log('adding connection ', connector.value)
  socket.emit('connector.add', connector.value);
  connector.value = '';
};

socket.on('connector.list', (data) => {
  console.log(data);
  for (let k in data) {
    let a = document.createElement('a');
    a.href = k;
    a.textContent = k;
    connections.appendChild(a);
  }
});