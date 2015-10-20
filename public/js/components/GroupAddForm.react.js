var React = require('react'); var VegaDNSActions = require('../actions/VegaDNSActions');
var GroupsStore = require('../stores/GroupsStore');
var VegaDNSActions = require('../actions/VegaDNSActions');

var GroupAddForm = React.createClass({
    getInitialState: function() {
        return {
            'name': ""
        }
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
        VegaDNSActions.addGroup(payload);
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

module.exports = GroupAddForm;
