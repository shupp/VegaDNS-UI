var React = require('react');
var ReactPropTypes = React.PropTypes;

var RecordListEntry = React.createClass({
    propTypes: {
        record: ReactPropTypes.object.isRequired
    },

    render: function() {
        var record = this.props.record;
        var distance = 'n/a';
        var weight = 'n/a';
        var port = 'n/a';

        if (typeof record.distance !== 'undefined') {
            distance = record.distance;
        }
        if (typeof record.weight !== 'undefined') {
            weight = record.weight;
        }
        if (typeof record.port !== 'undefined') {
            port = record.port;
        }

        return (
            <tr>
                <td>{record.name}</td>
                <td>{record.record_type}</td>
                <td>{record.value}</td>
                <td>{record.ttl}</td>
                <td>{distance}</td>
                <td>{weight}</td>
                <td>{port}</td>
                <td>{record.record_id}</td>
            </tr>
        );
    }
});

module.exports = RecordListEntry;
