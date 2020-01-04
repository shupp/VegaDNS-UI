var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var AuditLogListEntry = require('./AuditLogListEntry.react');
var Pager = require('./Pager.react');
var VegaDNSClient = require('../utils/VegaDNSClient');
var Select = require('react-select');
var URI = require('urijs');
var domains = [];

var AuditLogList = createClass({
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
            sort = 'time';
        }

        var order;
        if (typeof this.props.params.order !== "undefined") {
            order = this.props.params.order;
        } else {
            order = 'desc';
        }

        var selectedOptions = [];
        if (typeof this.props.params.selectedOptions !== "undefined") {
            selectedOptions = JSON.parse(URI.decode(this.props.params.selectedOptions));
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
            perpage: 25,
            sort: sort,
            order: order,
            options: [],
            selectedOptions: selectedOptions,
            search: search,
            logs: []
        }
    },

    componentWillMount: function() {
        this.loadDomains();
        this.listAuditLogs();
    },

    loadDomains() {
        VegaDNSClient.domains(false, false, false, false, false)
        .success(data => {
            var options = [
                {
                    value: 0,
                    label: "Group Member Changes"
                }
            ];
            for (var i = 0; i < data.domains.length; i++) {
                // Local lookups for domain name
                domains[data.domains[i].domain_id] = data.domains[i];
                var domain = data.domains[i];
                options.push({
                        value: domain.domain_id,
                        label: domain.domain
                });
            }
            this.setState({options: options});
        });
    },

    listAuditLogs: function() {
        var domainIds = false;
        if (this.state.selectedOptions.length > 0) {
            let domainIdList = [];
            for (let i = 0; i < this.state.selectedOptions.length;i++) {
                domainIdList.push(this.state.selectedOptions[i].value);
            }
            domainIds = domainIdList.join(',');
        }

        this.setState({
            logs: [],
            total: 0
        });

        VegaDNSClient.audit_logs(
            this.state.page,
            25, // perpage
            this.state.sort,
            this.state.order,
            this.state.search,
            domainIds
        ).success(data => {
            this.setState({
                logs: data.audit_logs,
                total: data.total_audit_logs
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Error retrieving audit logs: ",
                data
            );
        });
    },

    selectDomainIds(selectedOptions) {
        this.setState(
            {
                page: 1,
                selectedOptions: selectedOptions
            },
            this.listAuditLogs
        );
    },

    lookupDomainName(id) {
        var domainName = false;
        if (typeof domains[id] != 'undefined') {
            domainName = domains[id].domain;
        }
        return domainName;
    },

    createSortChangeUrl: function(header) {
        var neworder = this.state.order == 'desc' ? 'asc' : 'desc';
        var params = {
            order: neworder,
            sort: header
        };

        if (this.state.selectedOptions.length > 0) {
            params.selectedOptions = JSON.stringify(this.state.selectedOptions);
        }

        var hashUrl = "#auditLogs";
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

    searchLogs(e) {
        var value = e.target.value;
        if (value.length < 1) {
            value = false;
        }
        this.setState(
            {
                search: value,
                page: 1
            }
        , this.listAuditLogs);
    },

    clearSearch() {
        if (this.state.search !== false) {
            this.setState({search: false}, this.listAuditLogs);
        }
    },

    render: function() {
        var logs = [];

        for (var key in this.state.logs) {
            logs.push(
                <AuditLogListEntry
                    key={key}
                    audit_log={this.state.logs[key]}
                    domainName={this.lookupDomainName(this.state.logs[key].domain_id)}
                />
            );
        }

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
        if (this.state.selectedOptions.length > 0) {
            pagerParams.selectedOptions = JSON.stringify(this.state.selectedOptions);
        } else {
            delete pagerParams.selectedOptions;
        }
        var pager = <Pager
            page={this.state.page}
            perpage={this.state.perpage}
            total={this.state.total}
            route={this.props.route}
            params={pagerParams}
        />

        var tableheads = ['name', 'domain', 'entry', 'time'];
        var sortable = ['time'];
        var theads = [];
        var order_arrow = this.state.order == 'desc' ? 8595 : 8593;
        for (var i = 0; i < tableheads.length; i++) {
            if (sortable.indexOf(tableheads[i]) == -1) {
                // not sortable
                theads.push(<th key={i}>{tableheads[i]}</th>)
            } else {
                var arrow = this.state.sort == tableheads[i] ? ' ' + String.fromCharCode(order_arrow) : '';
                theads.push(<th key={i}><a href={this.createSortChangeUrl(tableheads[i])}>{tableheads[i]}{arrow}</a></th>);
            }
        }

        var logList = 
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="text-center">Audit Logs</h2>
                    </div>
                    <div>
                        <form className="form-horizontal" autoComplete="off">
                            <div className="form-group">
                                <label htmlFor="domain" className="col-sm-2 control-label">Filter</label>
                                <div className="col-sm-8">
                                    <Select
                                        options={this.state.options}
                                        value={this.state.selectedOptions}
                                        multi={true}
                                        name="selected_domains"
                                        onChange={this.selectDomainIds}
                                    />
                                </div>
                                <div className="col-sm-12">
                                    <br />
                                </div>
                            </div>
                        </form>
                    </div>
                    <div>
                        <form className="search-vertical-padding form-horizontal" autoComplete="off">
                            <div className="form-group">
                                <label htmlFor="domain_search" className="col-sm-2 control-label search-label-padding">Search Entry</label>
                                <div className="col-sm-8 btn-group">
                                    <input type="text" className="form-control" onChange={this.searchLogs} id="domain_search" value={searchValue} />
                                    <span onClick={this.clearSearch} className="searchclear">x</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="row">
                    <div className="text-center">{pager}</div>
                </div>
                <div className="col-md-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                {theads}
                            </tr>
                        </thead>
                        <tbody>
                            {logs}
                        </tbody>
                    </table>
                </div>
            </div>

        return (
            <section id="auditLogs">
                {logList}
            </section>
        );
    }
});

export default AuditLogList;
