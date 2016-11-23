var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var GroupEditForm = React.createClass({
    getInitialState: function() {
        return {
            'name': this.props.group.name
        }
    },
    handleChange: function(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },

    editGroup: function(e) {
        e.preventDefault();

        var payload = {}
        for (var key in this.state) {
            payload[key] = this.state[key];
        }
        payload["group_id"] = this.props.group.group_id;
        VegaDNSClient.editGroup(payload)
        .success(data => {
            VegaDNSActions.successNotification(
                "Group \"" + payload.name + "\" updated successfully"
            );
        }).error(data => {
            VegaDNSActions.addNotification(
                "Group edit failed: ",
                data
            );
        });
    },

    render: function() {
        return (
            <form className="form-horizontal" autoComplete="off">
                <div className="form-group">
                    <label htmlFor="name" className="col-sm-4 control-label">Group Name</label>
                    <div className="col-sm-4">
                        <input onChange={this.handleChange.bind(this, 'name')} className="form-control" id="name" value={this.state.name} />
                    </div>
                    <div className="col-sm-4">
                        <button type="submit" onClick={this.editGroup} className="btn btn-primary">Edit</button>
                    </div>
                </div>
            </form>
        );
    }
});

module.exports = GroupEditForm;
