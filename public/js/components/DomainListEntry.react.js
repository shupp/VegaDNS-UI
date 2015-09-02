var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');

var DomainListEntry = React.createClass({
    propTypes: {
        domain: ReactPropTypes.object.isRequired
    },

    render: function() {
        var domain = this.props.domain;
        var url = "#records?domain-id=" + domain.domain_id;
        return (
            <tr>
                <td><a href={url}>{domain.domain}</a></td>
                <td>{domain.status}</td>
                <td>{domain.domain_id}</td>
            </tr>
        );
    }
});

module.exports = DomainListEntry;
