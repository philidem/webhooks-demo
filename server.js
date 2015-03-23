var HTTP_PORT = 8080;

require('colors');

// Create an instance of rest-handler which will handle all incoming requests...
// (rest-handler is an alternative to express)
var restHandler = require('rest-handler').create();

// Create an HTTP server...
var server = require('http').createServer();

// Handle normal HTTP request
server.on('request', function(req, res) {
    restHandler.handle(req, res);
});

restHandler
    .middleware(require('rest-options-parser').middleware)

    .on('route', function(event) {
        var desc = '[route]'.green + ' ' + event.method.bold + ' ' + event.route.toString().grey;
        console.log(desc);
    });

restHandler.addRoute({
    method: '*',
    path: '/webhook/github',

    options: {
        payload: {
            source: 'body',
            type: 'object'
        },

        // pull the headers from the request
        headers: {
            source: 'request',
            type: 'object',
            required: true
        }
    },

    handler: function(rest) {
        var options = rest.options;

        var payload = options.payload;
        var headers = options.headers;

        console.log('HEADERS:\n' + JSON.stringify(headers, null, '    '));
        console.log('PAYLOAD:\n' + JSON.stringify(payload, null, '    '));

        // simply respond with 200 to acknowledge receipt of webhook notification
        rest.send(200);
    }
});

function _validateSignature(signature, payload, secret) {
    var pos = signature.indexOf('=');
    var algorithm = signature.substring(0, pos);
    signature = signature.substring(pos+1);

    var calculatedSignature = require('crypto')
        .createHmac(algorithm, secret)
        .update(payload)
        .digest('hex');

    console.log('Crypto Algorithm:    ', algorithm);
    console.log('Provided Signature:  ', signature);
    console.log('Calculated Signature:', calculatedSignature);

    return (signature === calculatedSignature);
}

restHandler.addRoute({
    method: '*',
    path: '/webhook/github-signed',

    options: {
        payload: {
            source: 'body',
            type: 'object'
        },

        rawPayload: {
            source: 'body',
            type: 'buffer'
        },

        // pull the headers from the request
        headers: {
            source: 'request',
            type: 'object',
            required: true
        }
    },

    handler: function(rest) {
        var options = rest.options;

        var payload = options.payload;
        var rawPayload = options.rawPayload;
        var headers = options.headers;

        // Signature will be something like: "sha1=b66a945d175a4580a9f5beaae7ee1ecaae2cb1f2"
        var signature = headers['x-hub-signature'];

        // This is the secret that we told GitHub to use to sign our messages
        var secret = 'mysecret';

        if (!_validateSignature(signature, rawPayload, secret)) {
            rest.send(400);
            return;
        }

        console.log('HEADERS:\n' + JSON.stringify(headers, null, '    '));
        console.log('PAYLOAD:\n' + JSON.stringify(payload, null, '    '));

        // simply respond with 200 to acknowledge receipt of webhook notification
        rest.send(200);
    }
});

// Listen on given port
server.listen(HTTP_PORT, function() {
    // Server is ready....
    console.log(('HTTP server is listening on port ' + HTTP_PORT));
});