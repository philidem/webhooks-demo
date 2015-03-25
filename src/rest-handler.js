// Create an instance of rest-handler which will handle all incoming requests...
// (rest-handler is an alternative to express)
var restHandler = module.exports = require('rest-handler').create();

restHandler
    .middleware(require('rest-options-parser').middleware)

    .on('route', function(event) {
        var desc = '[route]'.green + ' ' + event.method.bold + ' ' + event.route.toString().grey;
        console.log(desc);
    });
