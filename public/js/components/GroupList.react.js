var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var GroupsStore = require('../stores/GroupsStore');
var GroupListEntry = require('./GroupListEntry.react');
var GroupAddForm = require('./GroupAddForm.react');

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
        VegaDNSActions.listGroups();
    },

    componentDidMount: function() {
        GroupsStore.addChangeListener(this.onChange);
        GroupsStore.addRefreshChangeListener(this.listGroups);
    },

    componentWillUnmount: function() {
        GroupsStore.removeChangeListener(this.onChange);
        GroupsStore.removeRefreshChangeListener(this.listGroups);
    },

    onChange() {
        this.setState({
            groups: GroupsStore.getGroupList(),
            showAddForm: false
        });
    },

    render: function() {
        var groups = [];

        for (var key in this.state.groups) {
            groups.push(<GroupListEntry key={key} group={this.state.groups[key]} />);
        }

        var addGroupForm = <GroupAddForm hideCallback={this.hideAddGroupForm} />
        var keyList = 
                <div className="row">
                    <div className="col-md-2">
                    </div>
                    <div className="col-md-8">
                        <h2 className="text-center">Groups</h2>
                        <div className="pull-right">
                            <a className="btn btn-primary" onClick={this.showAddGroupForm} role="button">add</a>
                        </div>
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

module.exports = GroupList;
