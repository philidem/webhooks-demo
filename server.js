Error.stackTraceLimit = Infinity;

require('app-module-path').addPath(__dirname);

require('./lasso-project').server()

    .routes(require('src/routes/github').routes)

    .onServer(function(server) {
        require('src/socket-server').configure(server);
    })

	.onRestHandler(function(restHandler) {
		restHandler.middleware(require('rest-options-parser').middleware);
	})

	.route({
	    path: '/socket.io/**',
	    handler: function(rest) {
	        // don't do anything because socket.io already handled this
	    }
	})

	.start(function(err, server) {
		if (err) {
			throw err;
		}
	});
