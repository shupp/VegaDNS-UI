var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');

var Menu = React.createClass({
    render: function() {
        return (
            <ul>
                <li><a href="#domains">Domains</a></li>
            </ul>
        );
    },
});

module.exports = Menu;
