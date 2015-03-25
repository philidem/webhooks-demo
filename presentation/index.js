window.global = window;

var socket = require('socket.io-client')(':8080/');
//var markoRenderer = require('marko')

function appendNotification(html) {
    var containerEl = document.getElementById('githubNotifications');
    var notificationEl = document.createElement('div');
    notificationEl.className = 'notification';
    notificationEl.innerHTML = html;
    containerEl.appendChild(notificationEl);
}

var GITHUB_NOTIFICATION_HANDLERS = {
    'push': {
        template: require('marko').load(require.resolve('./github-push.marko')),
        handle: function(payload) {
            this.template.render(payload, function(err, html) {
                appendNotification(html);
            });
        }
    }
};

socket.on('githubNotification', function(data) {
    var eventName = data.eventName;
    var handler = GITHUB_NOTIFICATION_HANDLERS[eventName];
    if (handler) {
        handler.handle(data.payload);
    }
});
