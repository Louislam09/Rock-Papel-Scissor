const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,'public')));
server.listen(PORT, () => console.log(`Server running in port ${PORT}`));

const socket = require('socket.io');
const io = socket(server);

const connections = [null, null];
let playAgainConfirmations = [null, null];
const room = {};
const roomName = 'game';
const playersChoices = {};

const startServer = socket => {
    socket.join(roomName);
    let playerIndex = -1;
    
    socket.on('user-name', name => {
        for(const i in connections){
            if(connections[i] === null){
                playerIndex = i;
                break
            }
        }
        
        room[socket.id] = { userName: name , num: playerIndex };
        
        if(Object.keys(room).length === 2){
            io.emit('oponent-connected', {
                message: 'Tu Oponente Se Ha Conectado 😎'
            });
        }

        io.emit('players-info', room);
      
        // If there is a player 3, ignore it.
        if(playerIndex === -1) return;
      
        connections[playerIndex] = false;
    });

    socket.on('im-ready', data => {
        socket.to(roomName).broadcast.emit('oponent-ready', data);

        playersChoices[playerIndex] = data;
    })

    socket.on('disconnect', _ =>{
        console.log(`Player ${playerIndex} has  disconnected`);
        delete room[socket.id];

        socket.to(roomName).broadcast.emit('oponent-disconneted', {
            message: 'Tu Oponente Se Ha Desconectado 😥'
        });

        connections[playerIndex] = null;
        playAgainConfirmations[playerIndex] = null;
    })
}

io.on('connection', startServer);