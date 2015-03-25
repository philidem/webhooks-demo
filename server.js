var HTTP_PORT = 8080;

// This will allow us to require our own modules via require('src/some/module')
// (which helps us avoid using relative paths)
require('app-module-path').addPath(__dirname);

// Allow logging to the terminal with colors
require('colors');
require('marko/browser-refresh').enable();
require('optimizer/browser-refresh').enable('*.marko *.css *.less');

// Create an instance of rest-handler which will handle all incoming requests...
// (rest-handler is an alternative to express)
var restHandler = require('src/rest-handler');

// Create an HTTP server...
var server = module.exports = require('http').createServer();

// Create the socket.io server
require('src/socket-server');

restHandler.addRoute({
    path: '/socket.io/**',
    handler: function(rest) {
        // don't do anything because socket.io already handled this
    }
});

// Handle normal HTTP request
server.on('request', function(req, res) {
	restHandler.handle(req, res);
});

function _loadRoutes(modulePath) {
	console.log(('Loading routes from ' + modulePath.bold).green);
	require(modulePath);
}

_loadRoutes('src/routes/github');
_loadRoutes('src/routes/presentation');
_loadRoutes('src/routes/static');

// Configure the optimizer...
// The optimizer is used to render the presentation
require('optimizer').configure({
	// Don't fingerprint files for development
	fingerprintsEnabled: false,

	// Don't create bundles for development
	bundlingEnabled: false,

	// Don't minify for development
	minify: false,

	// Set appropriate optimizer flags for development
	flags: ['raptor-logging/browser', 'development'],

	// Use the "development" cache profile
	cacheProfile: 'development',

	plugins: [
        'optimizer-marko',
        'optimizer-less',
        'optimizer-image'
    ]
});

// Listen on given port
server.listen(HTTP_PORT, function() {
	// Server is ready....
	console.log(('HTTP server is listening on port ' + HTTP_PORT));

	if (process.send) {
		// If we were launched by browser-refresh, tell the parent process
		// that we are ready...
		process.send('online');
	}
});
