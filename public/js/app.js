var VegaDNSConfig = require('./utils/VegaDNSConfig');
// Override API Server Config if set in index.html
if (typeof VegaDNSHost !== "undefined") {
    VegaDNSConfig["host"] = VegaDNSHost;
}
if (typeof VegaDNSAPIVersion !== "undefined") {
    VegaDNSConfig["version"] = VegaDNSAPIVersion;
}

var React = require('react');
var VegaDNSApp = require('./components/VegaDNSApp.react');
var Notification = require('./components/Notification.react');
React.render(<Notification />, document.getElementById('notifications'));

function renderRoute () {
    var route = window.location.hash.substr(1);
    React.render(<VegaDNSApp route={route} />, document.getElementById('vegadnsapp'));
}

window.addEventListener('hashchange', renderRoute);
renderRoute();
