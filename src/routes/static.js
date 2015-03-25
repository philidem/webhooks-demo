var path = require('path');
var routeUtil = require('src/util/route-util');

routeUtil.addStaticRoute('/static', path.join(__dirname, '../../static'));