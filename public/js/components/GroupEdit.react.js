var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
var GroupEditForm = require('./GroupEditForm.react');
var GroupMemberList = require('./GroupMemberList.react');
var DomainGroupMapList = require('./DomainGroupMapList.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var GroupEdit = createClass({
    getInitialState: function() {
        return {
            group: {}
        }
    },

    componentWillMount: function() {
        this.getGroup();
    },

    getGroup: function() {
        VegaDNSClient.getGroup(this.props.params["group-id"])
        .success(data => {
            this.setState({
                group: data.group
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retreive group: ",
                data
            );
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("groups");
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

export default GroupEdit;
