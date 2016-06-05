'use strict';

const ws = require('./ws');

const socket = ws.getSocket();

const connections = document.querySelector('#connections');
const connector = document.querySelector('#connector');
const connectorBtn = document.querySelector('#connector-btn');

connectorBtn.onclick = function () {
  socket.emit('connector.add', connector.value);
};