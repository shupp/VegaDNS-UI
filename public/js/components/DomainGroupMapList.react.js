var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var DomainGroupMapsStore = require('../stores/DomainGroupMapsStore');
var VegaDNSActions = require('../actions/VegaDNSActions');
var Select = require('react-select');
var VegaDNSClient = require('../utils/VegaDNSClient');
var DomainGroupMapListEntry = require('./DomainGroupMapListEntry.react');
var domains = [];

var DomainGroupMapList = React.createClass({
    getInitialState: function() {
        return {
            domaingroupmaps: [],
            can_read: false,
            can_write: false,
            can_delete: false
        }
    },

    componentWillMount: function() {
        this.listDomainGroupMaps();
    },

    listDomainGroupMaps: function() {
        VegaDNSActions.listDomainGroupMaps(this.props.group.group_id);
    },

    componentDidMount: function() {
        DomainGroupMapsStore.addChangeListener(this.onChange);
        DomainGroupMapsStore.addRefreshChangeListener(this.listDomainGroupMaps);
    },

    componentWillUnmount: function() {
        DomainGroupMapsStore.removeChangeListener(this.onChange);
        DomainGroupMapsStore.removeRefreshChangeListener(this.listDomainGroupMaps);
    },

    onChange() {
        this.setState({
            domaingroupmaps: DomainGroupMapsStore.getDomainGroupMapList()
        });
    },

    setNewDomainPermission: function(e) {
        switch (e.target.name) {
            case "can_read":
                this.state.can_read = e.target.checked;
                break;
            case "can_write":
                this.state.can_write = e.target.checked;
                break;
            case "can_delete":
                this.state.can_delete = e.target.checked;
                break;
        }
    },

    addDomainGroupMap: function(e) {
        e.preventDefault();
        var permissions = {
            can_read: this.state.can_read ? 1 : 0,
            can_write: this.state.can_write ? 1 : 0,
            can_delete:this.state.can_delete ? 1 : 0
        }
        VegaDNSActions.addDomainGroupMap(this.props.group, domains[this.state.selected_domain], permissions);
    },

    selectDomainId(domainId) {
        this.state.selected_domain = domainId;
    },

    searchDomains(input, callback) {
        VegaDNSClient.searchDomains(input)
        .success(data => {
            var options = [];
            for (var i = 0; i < data.domains.length; i++) {
                domains[data.domains[i].domain_id] = data.domains[i];
                var domain = data.domains[i];
                options.push({
                        value: domain.domain_id,
                        label: domain.domain
                });
            }
            callback(
                null,
                {
                    options: options
                }
            );
        }).error(data => {
            var message = "Not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            callback(message, null);
        });
    },

    render: function() {
        var domaingroupmaps = [];
        for (var key in this.state.domaingroupmaps) {
            domaingroupmaps.push(<DomainGroupMapListEntry key={key} domaingroupmap={this.state.domaingroupmaps[key]} group={this.props.group} />);
        }

        return (
            <section id="domaingroupmaps">
                <h4 className="text-center">Add Domain to Group</h4>
                <form className="form-horizontal" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="domain" className="col-sm-2 control-label">Domain</label>
                        <div className="col-sm-8">
                            <Select
                                name="selected_domain"
                                autoload={false}
                                asyncOptions={this.searchDomains}
                                onChange={this.selectDomainId}
                            />
                            <input type="checkbox" onClick={this.setNewDomainPermission} defaultChecked={this.state.can_read} name="can_read" /> read | &nbsp;
                            <input type="checkbox" onClick={this.setNewDomainPermission} defaultChecked={this.state.can_write} name="can_write" /> write | &nbsp;
                            <input type="checkbox" onClick={this.setNewDomainPermission} defaultChecked={this.state.can_delete} name="can_delete" /> delete
                        </div>
                        <div className="col-sm-2">
                            <button type="submit" onClick={this.addDomainGroupMap} className="btn btn-primary">add</button>
                        </div>
                        <div className="col-sm-12">
                            <br />
                        </div>
                    </div>
                </form>

                <div>
                    <h4 className="text-center">Group Members</h4>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>domain</th>
                                <th>can read</th>
                                <th>can write</th>
                                <th>can delete</th>
                                <th>id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domaingroupmaps}
                        </tbody>
                    </table>
                </div>
            </section>
        );
    }
});

module.exports = DomainGroupMapList;
