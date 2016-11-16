var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var RecordsStore = require('../stores/RecordsStore');
var LocationsStore = require('../stores/LocationsStore');
var RecordListEntry = require('./RecordListEntry.react');
var Pager = require('./Pager.react');
var RecordAddForm = require('./RecordAddForm.react');
var URI = require('urijs');

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

        var search_name;
        if (typeof this.props.params.search_name !== "undefined") {
            search_name = decodeURIComponent(this.props.params.search_name);
        } else {
            search_name = false;
        }

        var search_value;
        if (typeof this.props.params.search_value !== "undefined") {
            search_value = decodeURIComponent(this.props.params.search_value);
        } else {
            search_value = false;
        }

        return {
            records: [],
            locations: [],
            domain: null,
            total: 0,
            page: page,
            sort: sort,
            order: order,
            perpage: 25,
            search_name: search_name,
            search_value: search_value,
            showAddForm: false
        }
    },

    showAddRecordForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddRecordForm: function() {
        this.setState({showAddForm: false});
    },

    createSortChangeUrl: function(header) {
        var neworder = this.state.order == 'desc' ? 'asc' : 'desc';
        var params = {
            order: neworder,
            sort: header,
            domain_id: this.props.params["domain-id"],
            search_name: this.state.search_name,
            search_value: this.state.search_value
        }

        var hashUrl = "#records";
        var fakeQueryUrl = URI("index.html");
        for (var key in params) {
            if (params[key] !== false) {
                var keytext = key;
                if (key == "domain_id") {
                    keytext = "domain-id";
                }
                fakeQueryUrl.addQuery(keytext, params[key]);
            }
        }
        return hashUrl + fakeQueryUrl.search();
    },

    componentWillMount: function() {
        this.listRecordsCallback(this.state.page);
        VegaDNSActions.listLocations();
    },

    searchRecordName(e) {
        var value = e.target.value;
        if (value.length < 1) {
            value = false;
        }
        this.setState(
            {
                search_name: value,
                page: 1
            },
            this.listRecordsCallback
        );
    },

    searchRecordValue(e) {
        var value = e.target.value;
        if (value.length < 1) {
            value = false;
        }
        this.setState(
            {
                search_value: value,
                page: 1
            },
            this.listRecordsCallback
        );
    },

    clearSearchName() {
        if (this.state.search_name !== false) {
            this.setState(
                {search_name: false},
                this.listRecordsCallback
            );
        }
    },

    clearSearchValue() {
        if (this.state.search_value !== false) {
            this.setState(
                {search_value: false},
                this.listRecordsCallback
            );
        }
    },

    editSoaRedirect: function() {
        VegaDNSActions.redirect("recordEditSOA?domain-id=" + this.props.params["domain-id"]);
    },

    listRecordsCallback: function(page=1) {
        VegaDNSActions.listRecords(
            this.props.params["domain-id"],
            page,
            this.state.perpage,
            this.state.sort,
            this.state.order,
            this.state.search_name,
            this.state.search_value
        )
    },

    componentDidMount: function() {
        RecordsStore.addChangeListener(this.onChange);
        RecordsStore.addRefreshChangeListener(this.onRefreshChange);
        LocationsStore.addChangeListener(this.updateLocations);
    },

    componentWillUnmount: function() {
        RecordsStore.removeChangeListener(this.onChange);
        RecordsStore.removeRefreshChangeListener(this.onRefreshChange);
        LocationsStore.removeChangeListener(this.updateLocations);
    },

    updateLocations() {
        this.setState({locations: LocationsStore.getLocationList()});
    },

    onChange() {
        this.setState({
            showAddForm: false,
            records: RecordsStore.getRecordList(),
            total: RecordsStore.getRecordTotal(),
            domain: RecordsStore.getDomain()
        });
    },

    onRefreshChange() {
        this.listRecordsCallback(this.state.page);
    },

    render: function() {
        var addRecordForm =
            <div className="row">
                <RecordAddForm locations={this.state.locations} domain={this.state.domain} hideCallback={this.hideAddRecordForm} />
            </div>

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
            records.push(<RecordListEntry key={key} record={this.state.records[key]} domain={this.state.domain} locations={this.state.locations} />);
        }
        var pagerParams = this.props.params;
        if (this.state.search_name !== false) {
            pagerParams.search_name = this.state.search_name;
        } else {
            delete pagerParams.search_name;
        }
        if (this.state.search_value !== false) {
            pagerParams.search_value = this.state.search_value;
        } else {
            delete pagerParams.search_value;
        }
        var pager = <Pager
            page={this.state.page}
            perpage={this.state.perpage}
            total={this.state.total}
            route={this.props.route}
            params={pagerParams}
        />

        var tableheads = ['name', 'type', 'value', 'ttl', 'distance', 'weight', 'port', 'location', 'edit', 'delete', 'id'];
        var sortable = ['name', 'type', 'value', 'ttl', 'distance'];
        var theads = [];
        for (var i = 0; i < tableheads.length; i++) {
            if (sortable.indexOf(tableheads[i]) == -1) {
                // not sortable
                if (tableheads[i] == 'id') {
                    theads.push(<th key={i} className="hidden-sm hidden-xs">{tableheads[i]}</th>)
                } else {
                    theads.push(<th key={i}>{tableheads[i]}</th>)
                }
            } else {
                var arrow = this.state.sort == tableheads[i] ? ' ' + String.fromCharCode(order_arrow) : '';
                theads.push(<th key={i}><a href={this.createSortChangeUrl(tableheads[i])}>{tableheads[i]}{arrow}</a></th>);
            }
        }

        var searchName = this.state.search_name;
        if (searchName === false) {
            searchName = "";
        }

        var searchValue = this.state.search_value;
        if (searchValue === false) {
            searchValue = "";
        }

        var recordList = 
            <div>
                <div className="row">
                    <h2 className="text-center">Records for {domain}</h2>
                </div>
                <div className="row">
                    <div className="col-md-6 text-center">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <div className="btn-group">
                                    <input type="text" className="form-control col-md-3" onChange={this.searchRecordName} id="search_name" value={searchName} placeholder="search record name"/>
                                    <span onClick={this.clearSearchName} className="searchclear">x</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-md-6 text-center">
                        <form className="form-horizontal">
                            <div className="form-group">
                                <div className="btn-group">
                                    <input type="text" className="form-control col-md-3" onChange={this.searchRecordValue} id="search_value" value={searchValue} placeholder="search record value" />
                                    <span onClick={this.clearSearchValue} className="searchclear">x</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-3 col-md-2 text-center">
                        <a className="btn btn-primary" onClick={this.editSoaRedirect} role="button">edit soa</a>
                    </div>
                    <div className="col-xs-6 col-md-8 text-center">
                        {pager}
                    </div>
                    <div className="col-xs-3 col-md-2 text-center">
                        <a className="btn btn-primary" onClick={this.showAddRecordForm} role="button">add</a>
                    </div>
                </div>
                <div className="row">
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
            </div>

        return (
            <section id="records">
                {this.state.showAddForm  ? addRecordForm : recordList}
            </section>
        );
    }
});

module.exports = RecordList;
