const io = require('socket.io-client');

const socket = io('http://localhost/', {
    auth: {
      token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwYjJkNDZlYS04MDczLTQ3ZmYtOWI5Mi00YmI5OTZiMTEzMTgiLCJpYXQiOjE3MjA1MjU5MTMsImV4cCI6MTcyMDUyOTUxM30.OCTj-TqtCN6gSGsDBDxKxxedf7lKFwUKHGPN6v0NB9I"
    }
  }
);  // Replace with your server URL

socket.on('connect', () => {
  console.log('Connected to server');
  
  socket.emit('chat message', 'Hello from client');
});

socket.on('notification', (msg) => {
  console.log(`Message from server: ${msg}`);
  console.log(msg);
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});
