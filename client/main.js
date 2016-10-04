'use strict';

const socket = io();
/////////////////////////////////////////

socket.on('connect', () => console.log("User connected"));
socket.on('disconnect', () => console.log("User disconnected"));
