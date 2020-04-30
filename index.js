var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

io.on('connection', (socket) => {

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });

    socket.on('chat message', (nick, msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', nick, msg);
    });

    socket.on('init message', (msg) => {
        io.emit('init message', msg);
    });

    socket.on('close message', (msg) => {
        io.emit('close message', msg);
    })
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});