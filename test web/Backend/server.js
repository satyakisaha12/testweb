const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: '*' } });

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.json());
app.use(cors());

io.on('connection', (socket) => {
    console.log('User connected');

    // Join Rooms and Channels
    socket.on('join-room', (room) => {
        socket.join(room);
    });

    // Messaging
    socket.on('message', ({ room, message }) => {
        io.to(room).emit('message', message);
    });

    // Handle Disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

server.listen(5000, () => console.log('Server running on port 5000'));
