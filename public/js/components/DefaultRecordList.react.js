var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DefaultRecordsStore = require('../stores/DefaultRecordsStore');
var DefaultRecordListEntry = require('./DefaultRecordListEntry.react');
var DefaultRecordAddForm = require('./DefaultRecordAddForm.react');

var DefaultRecordList = React.createClass({
    getInitialState: function() {
        return {
            records: [],
            showAddForm: false
        }
    },

    showAddRecordForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddRecordForm: function() {
        this.setState({showAddForm: false});
    },

    componentWillMount: function() {
        this.listDefaultRecordsCallback();
    },

    listDefaultRecordsCallback: function() {
        VegaDNSActions.listDefaultRecords();
    },

    componentDidMount: function() {
        DefaultRecordsStore.addChangeListener(this.onChange);
        DefaultRecordsStore.addRefreshChangeListener(this.onRefreshChange);
    },

    componentWillUnmount: function() {
        DefaultRecordsStore.removeChangeListener(this.onChange);
        DefaultRecordsStore.removeRefreshChangeListener(this.onRefreshChange);
    },

    onChange() {
        this.setState({
            showAddForm: false,
            records: DefaultRecordsStore.getDefaultRecordList()
        });
    },

    onRefreshChange() {
        this.listDefaultRecordsCallback();
    },

    render: function() {
        var addRecordForm = <DefaultRecordAddForm domain={this.state.domain} hideCallback={this.hideAddRecordForm} />

        var records = [];

        for (var key in this.state.records) {
            if (this.state.records[key].record_type == "SOA") {
                continue;
            }
            records.push(<DefaultRecordListEntry key={key} record={this.state.records[key]} />);
        }

        var tableheads = ['name', 'type', 'value', 'ttl', 'distance', 'weight', 'port', 'edit', 'delete', 'id'];
        var theads = [];
        for (var i = 0; i < tableheads.length; i++) {
            theads.push(<td key={i}>{tableheads[i]}</td>);
        }

        var recordList = 
            <div>
                <h2 className="text-center">Default Records</h2>
                <div className="pull-right">
                    <a className="btn btn-primary" onClick={this.showAddRecordForm} role="button">add</a>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {theads}
                        </tr>
                    </thead>
                    <tbody>
                        {records}
                    </tbody>
                </table>
            </div>

        return (
            <section id="records">
                {this.state.showAddForm  ? addRecordForm : recordList}
            </section>
        );
    }
});

module.exports = DefaultRecordList;
