const express = require('express')
const app = express()
var http = require('http').createServer(app);
var io = require('socket.io')(http);

let users = [];
let userconf = [];

app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

// app.get('/chat', (req,res) => {
//     res.sendFile(__dirname + '/views/chatroom.html');
// })

io.on('connection', (socket) => {
    console.log(users);
    console.log(socket.id)
    socket.on('disconnect', () => {
        console.log('user disconnected '+ socket.id);
    });

    socket.on('chat message', (nick, msg) => {
        console.log(socket.id + ' - message: ' + msg);
        io.emit('chat message', nick, msg);
    });

    socket.on('init message', (nickname, msg) => {
        let user = {
            socket_id: socket.id,
            name: nickname
        }
        users.push(user);
        console.log(users);
        io.emit('init message', nickname+msg, users);
    });

    socket.on('close message', (nickname, msg) => {
        let obj = users.find(o => o.name === nickname);
        let pos = users.indexOf(obj);
        users.splice(pos, 1);
        console.log(users);
        io.emit('close message', nickname+' has left the conversation', users);
    })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});

