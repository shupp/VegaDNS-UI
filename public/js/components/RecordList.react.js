var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordsStore = require('../stores/RecordsStore');
var RecordListEntry = require('./RecordListEntry.react');
var Pager = require('./Pager.react');
var LastPage = null;

var RecordList = React.createClass({
    getInitialState: function() {
        var page;
        if (typeof this.props.params.page !== "undefined") {
            page = this.props.params.page;
        } else {
            page = 1;
        }

        return {
            records: [],
            total: 0,
            page: page,
            perpage: 25
        }
    },

    componentWillMount: function() {
        this.listRecordsCallback(this.state.page);
    },

    pagerClickCallback: function(page) {
        this.listRecordsCallback(page);
        this.setState({page: page});
    },

    listRecordsCallback: function(page) {
        VegaDNSActions.listRecords(
            this.props.params["domain-id"],
            page,
            this.state.perpage
        )
    },

    componentDidMount: function() {
        RecordsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        RecordsStore.removeChangeListener(this.onChange);
    },

    onChange() {
        this.setState({
            records: RecordsStore.getRecordList(),
            total: RecordsStore.getRecordTotal()
        });
    },

    render: function() {
        var records = [];

        for (var key in this.state.records) {
            if (this.state.records[key].record_type == "SOA") {
                continue;
            }
            records.push(<RecordListEntry key={key} record={this.state.records[key]} />);
        }
        var pager = <Pager
            page={this.state.page}
            perpage={this.state.perpage}
            total={this.state.total}
            route={this.props.route}
            params={this.props.params}
            callback={this.pagerClickCallback}
        />

        return (
            <section id="records">
                <h1>Records</h1>
                {pager}
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
