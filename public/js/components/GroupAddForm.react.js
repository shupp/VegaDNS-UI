var React = require('react');
var createClass = require('create-react-class');
var ReactPropTypes = require('prop-types');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var GroupAddForm = createClass({
    getInitialState: function() {
        return {
            'name': ""
        }
    },

    propTypes: {
        listCallback: ReactPropTypes.func.isRequired
    },

    handleChange: function(name, e) {
        var change = {};
        change[name] = e.target.value;
        this.setState(change);
    },

    addGroup: function(e) {
        e.preventDefault();

        var payload = {}
        for (var key in this.state) {
            payload[key] = this.state[key];
        }

        VegaDNSClient.addGroup(payload)
        .success(data => {
            VegaDNSActions.successNotification(
                "Group \"" + payload.name + "\" created successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.addNotification(
                "Group creation failed: ",
                data
            );
        });
    },

    render: function() {
        return (
            <section id="add_group">
                <h3 className="text-center">Create a new group</h3>
                <form className="form-horizontal" autoComplete="off">
                    <div className="form-group">
                        <label htmlFor="name" className="col-sm-4 control-label">Name</label>
                        <div className="col-sm-8">
                            <input onChange={this.handleChange.bind(this, 'name')} className="form-control" id="name" />
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-4"></div>
                        <div className="col-sm-8">
                            <button type="submit" onClick={this.addGroup} className="btn btn-success">Create</button>
                            &nbsp;
                            <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </form>
            </section>
        );
    }
});

export default GroupAddForm;
