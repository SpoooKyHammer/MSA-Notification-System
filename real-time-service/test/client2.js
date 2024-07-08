const io = require('socket.io-client');

const socket = io('http://localhost:4001', {
    auth: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYjJkNDZlYS04MDczLTQ3ZmYtOWI5Mi00YmI5OTZiMTEzMTgiLCJpYXQiOjE3MjA0MzQ0MzEsImV4cCI6MTcyMDQzODAzMX0.ObbLrqXnuiSgQO6JSQnzIETOihLJQaAGLDZekEoaydk"
    }
  }
);  // Replace with your server URL

socket.on('connect', () => {
  console.log('Connected to server');
  
  socket.emit('chat message', 'Hello from client');
});

socket.on('notification', (msg) => {
  console.log(`Message from server: ${msg}`);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
