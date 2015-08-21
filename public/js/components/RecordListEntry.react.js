var React = require('react');
var ReactPropTypes = React.PropTypes;

var RecordListEntry = React.createClass({
    propTypes: {
        record: ReactPropTypes.object.isRequired
    },

    render: function() {
        var record = this.props.record;
        return (
            <tr>
                <td>{record.record_id}</td>
                <td>{record.name}</td>
                <td>{record.record_type}</td>
                <td>{record.value}</td>
            </tr>
        );
    }
});

module.exports = RecordListEntry;
