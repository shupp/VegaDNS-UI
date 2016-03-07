var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DomainsStore = require('../stores/DomainsStore');
var AccountsStore = require('../stores/AccountsStore');
var DomainListEntry = require('./DomainListEntry.react');
var DomainAddForm = require('./DomainAddForm.react');
var URI = require('urijs');
var Pager = require('./Pager.react');

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

    componentWillMount: function() {
        VegaDNSActions.listDomains(
            this.state.page,
            this.state.perpage,
            this.state.sort,
            this.state.order,
            this.state.search
        );
        VegaDNSActions.listAccounts();
    },

    componentDidMount: function() {
        DomainsStore.addRefreshChangeListener(this.onRefreshChange);
        DomainsStore.addChangeListener(this.onChange);
        AccountsStore.addRefreshChangeListener(this.onRefreshChange);
        AccountsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        DomainsStore.removeRefreshChangeListener(this.onRefreshChange);
        DomainsStore.removeChangeListener(this.onChange);
        AccountsStore.removeRefreshChangeListener(this.onRefreshChange);
        AccountsStore.removeChangeListener(this.onChange);
    },

    onChange() {
        var accounts = AccountsStore.getAccountList();
        var accountHash = {}
        for (var account in accounts) {
            accountHash[accounts[account].account_id] = accounts[account];
        }
        this.setState({
            domains: DomainsStore.getDomainList(),
            total: DomainsStore.getDomainTotal(),
            accounts: accountHash
        });
    },

    onRefreshChange() {
        VegaDNSActions.listDomains();
        VegaDNSActions.listAccounts();
    },

    searchDomains(e) {
        var value = e.target.value;
        if (value.length < 1) {
            value = false;
        }
        this.setState({search: value});
        VegaDNSActions.listDomains(value);
    },

    clearSearch() {
        if (this.state.search !== false) {
            this.setState({search: false});
            VegaDNSActions.listDomains();
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
                <div className="col-sm-6 col-md-4 pull left">
                    <form className="form-horizontal">
                        <div className="form-group">
                            <label htmlFor="domain_search" className="col-sm-2 control-label">Search</label>
                            <div className="col-sm-4 btn-group">
                                <input type="text" className="form-control" onChange={this.searchDomains} id="domain_search" value={searchValue} />
                                <span onClick={this.clearSearch} className="searchclear">x</span>
                            </div>
                        </div>
                    </form>
                </div>
                <div className="col-sm-6 col-md-4">
                    {pager}
                </div>
                <div className="pull-right">
                    <a className="btn btn-primary" onClick={this.showAddDomainForm} role="button">add</a>
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
