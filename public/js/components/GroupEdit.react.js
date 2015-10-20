var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var GroupsStore = require('../stores/GroupsStore');
var GroupEditForm = require('./GroupEditForm.react');
var GroupMemberList = require('./GroupMemberList.react');
var DomainGroupMapList = require('./DomainGroupMapList.react');

var GroupEdit = React.createClass({
    getInitialState: function() {
        return {
            group: {}
        }
    },

    componentWillMount: function() {
        this.getGroup();
    },

    getGroup: function() {
        VegaDNSActions.getGroup(this.props.params["group-id"]);
    },

    componentDidMount: function() {
        GroupsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        GroupsStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("groups");
    },

    onChange() {
        this.setState({group: GroupsStore.getGroup()});
    },

    render: function() {
        if (Object.keys(this.state.group).length) {
            return (
                <section id="group_edit">
                    <h3 className="text-center">Edit Group</h3>
                    <GroupEditForm key={this.state.group.group_id} group={this.state.group} cancelCallback={this.handleCancel} />
                    <div className="row">
                        <div className="col-md-6">
                            <GroupMemberList  group={this.state.group} />
                        </div>
                        <div className="col-md-6">
                            <DomainGroupMapList group={this.state.group} />
                        </div>
                    </div>
                </section>
            );
        }
        return (
            <section id="group_edit"></section>
        );

    }
});

module.exports = GroupEdit;
