var server = require('../server');
var io = module.exports = require('socket.io')(server);

var sockets = [];

exports.emit = function(eventName, data) {
    sockets.forEach(function(socket) {
        socket.emit(eventName, data);
    });
    console.log('Emitted ' + eventName);
};

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