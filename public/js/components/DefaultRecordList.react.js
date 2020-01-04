var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DefaultRecordListEntry = require('./DefaultRecordListEntry.react');
var DefaultRecordAddForm = require('./DefaultRecordAddForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

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

    editDefaultSoaRedirect: function() {
        VegaDNSActions.redirect("defaultRecordEditSOA");
    },

    componentWillMount: function() {
        this.listDefaultRecords();
    },

    listDefaultRecords: function() {
        this.setState({
            showAddForm: false,
            records: []
        });

        VegaDNSClient.defaultRecords()
        .success(data => {
            this.setState({
                records: data.default_records
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve default records: ",
                data
            );
        });
    },

    render: function() {
        var addRecordForm = <DefaultRecordAddForm domain={this.state.domain} hideCallback={this.hideAddRecordForm} listCallback={this.listDefaultRecords} />

        var records = [];

        for (var key in this.state.records) {
            if (this.state.records[key].record_type == "SOA") {
                continue;
            }
            records.push(<DefaultRecordListEntry key={key} record={this.state.records[key]} listCallback={this.listDefaultRecords} />);
        }

        var tableheads = ['name', 'type', 'value', 'ttl', 'distance', 'weight', 'port', 'edit', 'delete', 'id'];
        var theads = [];
        for (var i = 0; i < tableheads.length; i++) {
            theads.push(<td key={i}><b>{tableheads[i]}</b></td>);
        }

        var recordList = 
            <div>
                <h2 className="text-center">Default Records</h2>
                <div>
                    <span className="pull-left">
                        <a className="btn btn-primary" onClick={this.editDefaultSoaRedirect} role="button">edit soa</a>
                    </span>
                    <span className="pull-right">
                        <a className="btn btn-primary" onClick={this.showAddRecordForm} role="button">add</a>
                    </span>
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

export default DefaultRecordList;
