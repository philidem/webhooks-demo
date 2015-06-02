var io;

var sockets = [];

exports.emit = function(eventName, data) {
    sockets.forEach(function(socket) {
        socket.emit(eventName, data);
    });
    console.log('Emitted ' + eventName);
};

exports.configure = function(server) {
    io = require('socket.io')(server);

    io.on('connection', function(socket) {
        console.log('Client connected via socket.io');

        sockets.push(socket);

    	socket.on('disconnect', function() {
            for (var i = 0; i < sockets.length; i++) {
                if (sockets[i] === socket) {
                    sockets.splice(i, 1);
                }
            }
        });
    });

    console.log('Configured socket.io server');
};