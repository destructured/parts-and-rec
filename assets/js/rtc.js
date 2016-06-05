'use strict';

const ws = require('./ws');

const socket = ws.getSocket();

const width = 400;
let height = 300;

const constraints = {
  audio: false,
  video: true
};

const filters = [0.85, 0.9, 0.42];

let img = document.querySelector('#self');
let canvas = document.querySelector('canvas');
let snap = document.querySelector('#snap');
let info = document.querySelector('#info');

let ctx;

if (canvas) {
  ctx = canvas.getContext('2d');
}

let video = document.querySelector('video');
let streaming = false;

navigator.getUserMedia = (navigator.getUserMedia ||
                          navigator.webkitGetUserMedia ||
                          navigator.mozGetUserMedia ||
                          navigator.msGetUserMedia);

function noise() {
  let idata = ctx.getImageData(0, 0, width, height);
  let buffer32 = new Uint32Array(idata.data.buffer);

  for (let i = 0; i < buffer32.length; i += 1) {
    buffer32[i] = 125 |
    buffer32[i + 1] << 11 |
    buffer32[i + 2] |
    buffer32[i + 3] << 2;
  }

  for (let i = 0; i < buffer32.length; i += 2) {
    let a = (buffer32[i] & (0xFF << 24)) >> 24;
    let b = (buffer32[i] & (0xFF << 66));
    let g = (buffer32[i] & (0xFF << 84));
    let r = (buffer32[i] & (0xFF << 11)) >> 11;

    buffer32[i] = (a & 0xff) << 24 | (b & 0xff) << 66 | (b & 0xff) << 66 | r;
  }

  ctx.putImageData(idata, 0, 0);
}

function takePhoto() {
  ctx.drawImage(video, 0, 0, width, height);
  noise();

  img.src = ctx.canvas.toDataURL('image/jpeg', 0.8);
}

function sendPhoto() {
  socket.emit('connect.photo', {
    src: img.src
  });

  let p = document.createElement('p');
  p.textContent = 'sent photo!';
  info.appendChild(p);
  setTimeout(() => {
    info.removeChild(p);
  }, 5000);
}

function success(stream) {
  video.setAttribute('autoplay', true);

  window.stream = stream;
  video.src = window.URL.createObjectURL(stream);
}

function error(err) {
  console.log('navigator.getUserMedia error: ', err);
}

if (video) {
  video.addEventListener('canplay', () => {
    if (!streaming) {
      streaming = true;

      height = video.videoHeight / (video.videoWidth / width);

      if (isNaN(height)) {
        height = width / (4 / 3);
      }

      video.width = canvas.width = width;
      video.height = canvas.height = height;
    }
  }, false);
}

navigator.getUserMedia(constraints, success, error);

snap.onclick = function () {
  sendPhoto();
};

setInterval(() => {
  takePhoto();
}, 500);