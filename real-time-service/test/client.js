const io = require('socket.io-client');

const socket = io('http://localhost:4001', {
    auth: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIxMmQzYzJhMy0yOGM4LTQwMmQtOGU0Yi02NDBhYTY5YTFmNzciLCJpYXQiOjE3MjA0MzMwMDcsImV4cCI6MTcyMDQzNjYwN30.Zt-9I67g4iimiecR3E7Nq-gfYn4ls4MeRJwU4e_2fk4"
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
