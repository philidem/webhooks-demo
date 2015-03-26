/**
 * This function is used to validate a signature that was calculated by the
 * remote party.
 * @param {String} signature the signature (e.g. "sha1=b66a945d175a4580a9f5beaae7ee1ecaae2cb1f2")
 * @param {Buffer} payload the Buffer containing the payload data
 * @param {String} secret the pre-shared secret
 */
function _validateSignature(signature, payload, secret) {
    var algorithm;
    var pos = signature.indexOf('=');
    if (pos === -1) {
        // This branch will likely never by called because GitHub
        // will include the algorithm in the signature.
        // Default to "sha1" hashing...
        algorithm = 'sha1';
    } else {
        // Use the algorithm identified in the signature
        // and then remove the prefix for future comparison.
        algorithm = signature.substring(0, pos);
        signature = signature.substring(pos+1);
    }

    var calculatedSignature = require('crypto')
        .createHmac(algorithm, secret)
        .update(payload)
        .digest('hex');

    console.log('Crypto Algorithm:    ', algorithm);
    console.log('Provided Signature:  ', signature);
    console.log('Calculated Signature:', calculatedSignature);

    return (signature === calculatedSignature);
}

var restHandler = require('src/rest-handler');
var socketServer = require('src/socket-server');

/*
This route demonstrates how to handle a GitHub webhook notification.
If GitHub provides a signature for the payload, then we'll validate
the signature by calculating our own signature using the same pre-shared
secret.
*/
restHandler.addRoute({
    method: 'POST',
    path: '/webhook/github',

    options: {
        // This parameter will be used get the parsed payload body
        // which will have been converted to a JavaScript object.
        payload: {
            source: 'body',
            type: 'object'
        },

        // This parameter will be used to get the raw payload as a Buffer.
        // We need the raw bytes so that we can accurately calculate
        // the signature if GitHub signs the payload.
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
        if (signature) {
            // This is the secret that we told GitHub to use to sign our messages
            var secret = 'mysecret';

            if (!_validateSignature(signature, rawPayload, secret)) {
                rest.send(400);
                return;
            }
        }

        console.log('HEADERS:\n' + JSON.stringify(headers, null, '    '));
        console.log('PAYLOAD:\n' + JSON.stringify(payload, null, '    '));

        // simply respond with 200 to acknowledge receipt of webhook notification
        rest.send(200);

        /* ---- EVERYTHING AFTER THIS LINE IS OUT-OF-BAND ---- */

        // Emit a socket.io event to all of our listeners to let them know
        // that we received a github notification.
        socketServer.emit('githubNotification', {
            eventName: headers['x-github-event'],
            payload: payload
        });
    }
});