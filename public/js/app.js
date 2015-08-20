var React = require('react');
var VegaDNSApp = require('./components/VegaDNSApp.react');

function renderRoute () {
    var route = window.location.hash.substr(1);
    React.render(<VegaDNSApp route={route} />, document.getElementById('vegadnsapp'));
}

window.addEventListener('hashchange', renderRoute);
renderRoute();
