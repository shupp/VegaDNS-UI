var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var AuditLogsStore = require('../stores/AuditLogsStore');
var AuditLogListEntry = require('./AuditLogListEntry.react');
var Pager = require('./Pager.react');
var VegaDNSClient = require('../utils/VegaDNSClient');
var Select = require('react-select');
var URI = require('urijs');
var domains = [];

var AuditLogList = React.createClass({
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

        var domainIds = "";
        if (typeof this.props.params.domainIds !== "undefined") {
            domainIds = this.props.params.domainIds;
        }

        var selectedOptions = [];
        if (typeof this.props.params.selectedOptions !== "undefined") {
            selectedOptions = JSON.parse(URI.decode(this.props.params.selectedOptions));
        }

        return {
            total: 0,
            page: page,
            perpage: 25,
            sort: sort,
            order: order,
            domainIds: domainIds,
            options: [],
            selectedOptions: selectedOptions,
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
            var options = [];
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
        if (this.state.domainIds.length > 0) {
            domainIds = this.state.domainIds;
        }
        VegaDNSActions.listAuditLogs(
            this.state.page,
            25, // perpage
            this.state.sort,
            this.state.order,
            domainIds
        );
    },

    selectDomainIds(domainIds, selectedOptions) {
        this.setState(
            {
                page: 1,
                domainIds: domainIds,
                selectedOptions: selectedOptions
            },
            this.listAuditLogs
        );
    },

    componentDidMount: function() {
        AuditLogsStore.addChangeListener(this.onChange);
        AuditLogsStore.addRefreshChangeListener(this.listAuditLogs);
    },

    componentWillUnmount: function() {
        AuditLogsStore.removeChangeListener(this.onChange);
        AuditLogsStore.removeRefreshChangeListener(this.listAuditLogs);
    },

    onChange() {
        this.setState({
            logs: AuditLogsStore.getAuditLogList(),
            total: AuditLogsStore.getAuditLogTotal()
        });
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

        if (this.state.domainIds.length > 0) {
            params.domainIds = this.state.domainIds;
        }
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

        var pagerParams = this.props.params;
        if (this.state.domainIds.length > 0) {
            pagerParams.domainIds = this.state.domainIds;
        } else {
            delete pagerParams.domainIds;
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
                                <label htmlFor="domain" className="col-sm-2 control-label">Filter by Domain</label>
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

module.exports = AuditLogList;
