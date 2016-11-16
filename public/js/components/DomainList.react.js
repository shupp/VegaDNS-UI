var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DomainsStore = require('../stores/DomainsStore');
var DomainListEntry = require('./DomainListEntry.react');
var DomainAddForm = require('./DomainAddForm.react');
var URI = require('urijs');
var Pager = require('./Pager.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var DomainList = React.createClass({
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

        var search;
        if (typeof this.props.params.search !== "undefined") {
            search = decodeURIComponent(this.props.params.search);
        } else {
            search = false;
        }

        return {
            total: 0,
            page: page,
            sort: sort,
            order: order,
            perpage: 25,
            search: search,
            domains: [],
            accounts: [],
            showAddForm: false
        }
    },

    createSortChangeUrl: function(header) {
        var neworder = this.state.order == 'desc' ? 'asc' : 'desc';
        var params = {
            order: neworder,
            sort: header,
            search: this.state.search
        }

        var hashUrl = "#domains";
        var fakeQueryUrl = URI("index.html");
        for (var key in params) {
            if (params[key] !== false) {
                var keytext = key;
                fakeQueryUrl.addQuery(keytext, params[key]);
            }
        }
        return hashUrl + fakeQueryUrl.search();
    },

    showAddDomainForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddDomainForm: function() {
        this.setState({showAddForm: false});
    },

    listDomains() {
        VegaDNSActions.listDomains(
            this.state.page,
            this.state.perpage,
            this.state.sort,
            this.state.order,
            this.state.search
        );

        VegaDNSClient.accounts()
        .success(data => {
            let accounts = data.accounts;
            let accountHash = {}
            for (let account in accounts) {
                accountHash[accounts[account].account_id] = accounts[account];
            }
            this.setState({
                accounts: accountHash
            });
        }).error(data => {
            VegaDNSActions.errorNotification("Unable to retrieve accounts: ", data);
        });
    },

    componentWillMount: function() {
        this.listDomains();
    },

    componentDidMount: function() {
        DomainsStore.addRefreshChangeListener(this.onRefreshChange);
        DomainsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DomainsStore.removeRefreshChangeListener(this.onRefreshChange);
        DomainsStore.removeChangeListener(this.onChange);
    },

    onChange() {
        this.setState({
            domains: DomainsStore.getDomainList(),
            total: DomainsStore.getDomainTotal()
        });
    },

    onRefreshChange() {
        this.listDomains();
    },

    searchDomains(e) {
        var value = e.target.value;
        if (value.length < 1) {
            value = false;
        }
        this.setState({search: value}, this.listDomains);
    },

    clearSearch() {
        if (this.state.search !== false) {
            this.setState({search: false}, this.listDomains);
        }
    },

    render: function() {
        var domains = [];

        for (var key in this.state.domains) {
            var domain = this.state.domains[key];
            var domain_owner = null;
            if (typeof this.state.accounts[domain.owner_id] !== "undefined") {
                domain_owner = this.state.accounts[domain.owner_id];
            }
            domains.push(<DomainListEntry key={key} domain={this.state.domains[key]} domain_owner={domain_owner} account={this.props.account} />);
        }

        var addDomainForm = <DomainAddForm hideCallback={this.hideAddDomainForm} />
        var searchValue = this.state.search;
        if (searchValue === false) {
            searchValue = "";
        }

        var pagerParams = this.props.params;
        if (this.state.search !== false) {
            pagerParams.search = this.state.search;
        } else {
            delete pagerParams.search;
        }
        var pager = <Pager
            page={this.state.page}
            perpage={this.state.perpage}
            total={this.state.total}
            route={this.props.route}
            params={pagerParams}
        />

        var order_arrow = this.state.order == 'desc' ? 8595 : 8593;
        var tableheads = ['name', 'status', 'owner', 'delete', 'id'];
        var sortable = ['name', 'status'];
        var theads = [];
        for (var i = 0; i < tableheads.length; i++) {
            if (sortable.indexOf(tableheads[i]) == -1) {
                // not sortable
                if (tableheads[i] == 'id') {
                    theads.push(<th key={i} className="hidden-xs">{tableheads[i]}</th>)
                } else {
                    theads.push(<th key={i}>{tableheads[i]}</th>)
                }
            } else {
                var arrow = this.state.sort == tableheads[i] ? ' ' + String.fromCharCode(order_arrow) : '';
                theads.push(<th key={i}><a href={this.createSortChangeUrl(tableheads[i])}>{tableheads[i]}{arrow}</a></th>);
            }
        }

        var domainList = 
            <div>
                <div className="row">
                    <h2 className="text-center">Domains</h2>
                </div>
                <div className="row">
                    <div className="col-xs-12 col-sm-5 col-md-4 xs-text-center text-left vcenter">
                        <form className="search-vertical-padding form-horizontal">
                            <div className="form-group">
                                <label htmlFor="domain_search" className="control-label search-label-padding">Search</label>
                                <div className="btn-group">
                                    <input type="text" className="form-control" onChange={this.searchDomains} id="domain_search" value={searchValue} />
                                    <span onClick={this.clearSearch} className="searchclear">x</span>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="col-xs-12 col-sm-6 col-md-4 xs-text-center vcenter">
                        {pager}
                    </div>
                    <div className="col-xs-12 col-sm-1 col-md-4 text-right vcenter">
                        <a className="btn btn-primary" onClick={this.showAddDomainForm} role="button">add</a>
                    </div>
                </div>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            {theads}
                        </tr>
                    </thead>
                    <tbody>
                        {domains}
                    </tbody>
                </table>
            </div>

        return (
            <section id="domains">
                {this.state.showAddForm  ? addDomainForm : domainList}
            </section>
        );
    }
});

module.exports = DomainList;
