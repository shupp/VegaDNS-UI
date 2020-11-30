var VegaDNSConfig = require('./utils/VegaDNSConfig');
// Override API Server Config if set in index.html
if (typeof VegaDNSHost !== "undefined") {
    VegaDNSConfig["host"] = VegaDNSHost;
}
if (typeof VegaDNSAPIVersion !== "undefined") {
    VegaDNSConfig["version"] = VegaDNSAPIVersion;
}

// CSS imports
import 'react-select/dist/react-select.css';

var React = require('react');
var ReactDOM = require('react-dom');
var VegaDNSApp = require('./components/VegaDNSApp.react');
import Notification from './components/Notification.react';
ReactDOM.render(<Notification />, document.getElementById('notifications'));

function renderRoute () {
    var route = window.location.hash.substr(1);
    ReactDOM.render(<VegaDNSApp route={route} />, document.getElementById('vegadnsapp'));
}

window.addEventListener('hashchange', renderRoute);
renderRoute();
