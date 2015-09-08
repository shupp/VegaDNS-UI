var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');

var ApiKeyListEntry = React.createClass({
    propTypes: {
        apikey: ReactPropTypes.object.isRequired
    },

    render: function() {
        var apikey = this.props.apikey;
        return (
            <tr>
                <td>{apikey.description}</td>
                <td>{apikey.key}</td>
                <td>{apikey.secret}</td>
                <td>{apikey.apikey_id}</td>
            </tr>
        );
    }
});

module.exports = ApiKeyListEntry;
