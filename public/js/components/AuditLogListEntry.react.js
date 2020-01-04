var React = require('react');
var ReactPropTypes = React.PropTypes;
var VegaDNSActions = require('../actions/VegaDNSActions');

var AuditLogListEntry = React.createClass({
    getInitialState: function() {
        return {
            domainName: this.props.domainName
        }
    },

    propTypes: {
        audit_log: ReactPropTypes.object.isRequired
    },

    timestampToDate(timestamp) {
        var d = new Date(timestamp * 1000);
        return d.toLocaleDateString() + "-" + d.toTimeString();
    },

    componentWillReceiveProps: function(props) {
        this.setState({domainName: props.domainName});
    },

    render: function() {
        var audit_log = this.props.audit_log;
        var domainName = audit_log.domain_id;
        if (audit_log.domain_id == 0) {
            domainName = "n/a";
        } else if (this.state.domainName !== false) {
            domainName = this.state.domainName;
        }

        return (
            <tr>
                <td>{audit_log.name} ({audit_log.email})</td>
                <td>{domainName}</td>
                <td>{audit_log.entry}</td>
                <td>{this.timestampToDate(audit_log.time)}</td>
            </tr>
        );
    }
});

export default AuditLogListEntry;
