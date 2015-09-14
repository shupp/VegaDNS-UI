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

        var sort;
        if (typeof this.props.params.sort !== "undefined") {
            sort = this.props.params.sort;
        } else {
            sort = 'name';
        }

        var order;
        if (typeof this.props.params.order !== "undefined") {
            order = this.props.params.order;
        } else {
            order = 'asc';
        }

        return {
            records: [],
            domain: null,
            total: 0,
            page: page,
            sort: sort,
            order: order,
            perpage: 25
        }
    },

    createSortChangeUrl: function(header) {
        var neworder = this.state.order == 'desc' ? 'asc' : 'desc';
        var url = "#records?domain-id=" + this.props.params["domain-id"];
        var url =  url + "&sort=" + header + "&order=" + neworder;

        return url;
    },

    componentWillMount: function() {
        this.listRecordsCallback(this.state.page);
    },

    sortClickCallback: function(sort, order) {
        this.setState({
            sort: sort,
            order: order,
            page: 1
        });
        this.listRecordsCallback(1);
    },

    listRecordsCallback: function(page) {
        VegaDNSActions.listRecords(
            this.props.params["domain-id"],
            page,
            this.state.perpage,
            this.state.sort,
            this.state.order
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
            total: RecordsStore.getRecordTotal(),
            domain: RecordsStore.getDomain()
        });
    },

    render: function() {
        var records = [];
        var domain = null;
        var order_arrow = this.state.order == 'desc' ? 8595 : 8593;

        if (this.state.domain !== null) {
            domain = this.state.domain.domain;
        }

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
        />

        var tableheads = ['name', 'type', 'value', 'ttl', 'distance', 'weight', 'port', 'id'];
        var sortable = ['name', 'type', 'value', 'ttl', 'distance'];
        var theads = [];
        for (var i = 0; i < tableheads.length; i++) {
            if (sortable.indexOf(tableheads[i]) == -1) {
                // not sortable
                theads.push(<th key={i}>{tableheads[i]}</th>)
            } else {
                var arrow = this.state.sort == tableheads[i] ? ' ' + String.fromCharCode(order_arrow) : '';
                theads.push(<th key={i}><a href={this.createSortChangeUrl(tableheads[i])}>{tableheads[i]}{arrow}</a></th>);
            }
        }

        return (
            <section id="records">
                <h2>Records for {domain}</h2>
                {pager}
                <table className="table table-hover">
                    <thead>
                        {theads}
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
