var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordsStore = require('../stores/RecordsStore');
var RecordListEntry = require('./RecordListEntry.react');

var RecordList = React.createClass({
    getInitialState: function() {
        return {
            records: []
        }
    },

    componentWillMount: function() {
        VegaDNSActions.listRecords(this.props.params["domain-id"]);
    },

    componentDidMount: function() {
        RecordsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        RecordsStore.removeChangeListener(this.onChange);
    },

    onChange() {
        this.setState({records: RecordsStore.getRecordList()});
    },

    render: function() {
        var records = [];

        for (var key in this.state.records) {
            if (this.state.records[key].record_type == "SOA") {
                continue;
            }
            records.push(<RecordListEntry key={key} record={this.state.records[key]} />);
        }

        return (
            <section id="records">
                <h1>Records</h1>
                <table className="table table-hover">
                    <thead>
                        <th>id</th>
                        <th>name</th>
                        <th>type</th>
                        <th>value</th>
                    </thead>
                    <tbody>
                        {records}
                    </tbody>
                </table>
            </section>
        );
    }
});

module.exports = RecordList;
