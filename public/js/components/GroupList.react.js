var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var GroupListEntry = require('./GroupListEntry.react');
var GroupAddForm = require('./GroupAddForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var GroupList = React.createClass({
    getInitialState: function() {
        return {
            groups: [],
            showAddForm: false
        }
    },

    showAddGroupForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddGroupForm: function() {
        this.setState({showAddForm: false});
    },

    componentWillMount: function() {
        this.listGroups();
    },

    listGroups: function() {
        this.setState({
            groups: [],
            showAddForm: false
        });

        VegaDNSClient.groups()
        .success(data => {
            this.setState({
                groups: data.groups,
                showAddForm: false
            });
        }).error(data => {
            "Unable to retreive groups: ",
            data
        });
    },

    render: function() {
        var groups = [];

        var groupAddButton = null;
        if (this.props.account.account_type == "senior_admin") {
            groupAddButton = <div className="pull-right">
                <a className="btn btn-primary" onClick={this.showAddGroupForm} role="button">add</a>
            </div>
        }

        for (var key in this.state.groups) {
            groups.push(<GroupListEntry key={key} group={this.state.groups[key]} listCallback={this.listGroups} />);
        }

        var addGroupForm = <GroupAddForm hideCallback={this.hideAddGroupForm} listCallback={this.listGroups} />
        var keyList = 
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-8">
                        <h2 className="text-center">Groups</h2>
                        {groupAddButton}
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>name</th>
                                    <th>edit</th>
                                    <th>delete</th>
                                    <th>id</th>
                                </tr>
                            </thead>
                            <tbody>
                                {groups}
                            </tbody>
                        </table>
                    </div>
                    <div className="col-md-2">
                    </div>
                </div>

        return (
            <section id="groups">
                {this.state.showAddForm  ? addGroupForm : keyList}
            </section>
        );
    }
});

export default GroupList;
