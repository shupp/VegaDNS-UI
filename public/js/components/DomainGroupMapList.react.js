var React = require('react');
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
            can_delete: false,
            selected_domain: null
        }
    },

    componentWillMount: function() {
        this.listDomainGroupMaps();
    },

    listDomainGroupMaps: function() {
        this.setState({
            domaingroupmaps: [],
            can_read: false,
            can_write: false,
            can_delete: false,
            selected_domain: null
        });

        VegaDNSClient.domaingroupmaps(this.props.group.group_id)
        .success(data => {
            this.setState({
                domaingroupmaps: data.domaingroupmaps
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve domain group maps: ",
                data
            );
        });
    },

    setNewDomainPermission: function(e) {
        switch (e.target.name) {
            case "can_read":
                this.setState({
                    can_read: e.target.checked
                });
                break;
            case "can_write":
                this.setState({
                    can_write: e.target.checked
                });
                break;
            case "can_delete":
                this.setState({
                    can_delete:e.target.checked
                });
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

        let domain = domains[this.state.selected_domain.value];
        let group = this.props.group;

        VegaDNSClient.addDomainGroupMap(group.group_id, domain.domain_id, permissions)
        .success(data => {
            VegaDNSActions.successNotification(
                domain.domain + " added to group \"" + group.name + "\" successfully",
                true
            );
            this.listDomainGroupMaps();
        }).error(data => {
            VegaDNSActions.addNotification(
                "Adding domain to group failed: ",
                data
            );
        });

        return false;
    },

    selectDomainId(domainId) {
        this.setState({
            selected_domain: domainId
        });
    },

    searchDomains(input, callback) {
        VegaDNSClient.domains(false, false, false, false, input)
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
            domaingroupmaps.push(<DomainGroupMapListEntry key={key} domaingroupmap={this.state.domaingroupmaps[key]} group={this.props.group} listCallback={this.listDomainGroupMaps} />);
        }

        return (
            <section id="domaingroupmaps">
                <h4 className="text-center">Add Domain to Group</h4>
                <form className="form-horizontal" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="domain" className="col-sm-2 control-label">Domain</label>
                        <div className="col-sm-8">
                            <Select.Async
                                name="selected_domain"
                                isLoading={true}
                                cache={false}
                                loadOptions={this.searchDomains}
                                onChange={this.selectDomainId}
                                value={this.state.selected_domain}
                            />
                            <input type="checkbox" onClick={this.setNewDomainPermission} checked={this.state.can_read} name="can_read" /> read | &nbsp;
                            <input type="checkbox" onClick={this.setNewDomainPermission} checked={this.state.can_write} name="can_write" /> write | &nbsp;
                            <input type="checkbox" onClick={this.setNewDomainPermission} checked={this.state.can_delete} name="can_delete" /> delete
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
                    <h4 className="text-center">Domains in this group</h4>
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

export default DomainGroupMapList;
