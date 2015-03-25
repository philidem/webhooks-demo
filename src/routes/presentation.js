var routeUtil = require('src/util/route-util');

routeUtil.addMarkoIndexFileRoute('/presentation', require.resolve('presentation/index.marko'), {
    title: 'Guide to Using Webhooks with Node.js'
});