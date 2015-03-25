var path = require('path');
var restHandler = require('src/rest-handler');

// Helper function that is used to add route to render index.marko file
exports.addMarkoIndexFileRoute = function(urlPrefix, templateFile, templateData) {
    var marko = require('marko');
    var template = marko.load(require.resolve(templateFile));

    // Add redirect route
    restHandler.addRoute({
        method: 'GET',
        path: urlPrefix,
        handler: function(rest) {
            // Redirect to path that ends with "/"...
            rest.res.writeHead(301, {
                location: urlPrefix + '/'
            });
            rest.res.end();
        }
    });

    // Add route to handle index file
    restHandler.addRoute({
        method: 'GET',
        path: urlPrefix + '/',
        handler: function(rest) {
            template.render(templateData, rest.res, function(err, result) {
                if (err) {
                    console.error('Error rendering ' + rest.req.url, err.stack || err);
                } else {
                    console.log('Rendered page ' + rest.req.url);
                }
            });
        }
    });
};

// Helper function to add a route to handle static routes from within given base directory
exports.addStaticRoute = function(urlPrefix, baseDir) {

    baseDir = path.normalize(baseDir);

    console.log('Static directory: ' + baseDir);

    var send = require('send');
    restHandler.addRoute({
        method: 'GET',
        path: urlPrefix + '/**',
        log: false,
        handler: function(rest) {
            var filePath = rest.params[0];
            var sender = send(rest.req, filePath, {
                root: baseDir,
                index: 'index.html'
            });

            sender
                .on('error', function(err) {
                    rest.error(err);
                })
                .on('directory', function(dir) {
                    sender.path = filePath + '/index.html';
                    sender.pipe(rest.res);
                })
                .pipe(rest.res);
        }
    });
};