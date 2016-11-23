var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var LocationPrefixEditForm = React.createClass({
    getInitialState: function() {
        return {
            prefix: this.props.location_prefix.prefix,
            prefix_description: this.props.location_prefix.prefix_description,
            prefix_type: this.props.location_prefix.prefix_type
        }
    },

    handlePrefixChange: function(e) {
        this.setState({
            prefix: e.target.value
        });
    },

    handleDescriptionChange: function(e) {
        this.setState({
            prefix_description: e.target.value
        });
    },

    handleTypeChange: function(e) {
        this.setState({
            prefix_type: e.target.value
        });
    },

    editLocationPrefix: function(e) {
        e.preventDefault();

        VegaDNSClient.editLocationPrefix(
            this.props.location_prefix.prefix_id,
            this.state.prefix,
            this.state.prefix_description,
            this.state.prefix_type
        ).success(data => {
            VegaDNSActions.successNotification(
                "Location prefix edited successfully"
            );
            VegaDNSActions.redirect("locationPrefixes?location_id=" + data.location_prefix.location_id);
        }).error(data => {
            VegaDNSActions.addNotification(
                "Unable to edit location prefix: ",
                data
            );
        });

        return false;
    },

    handleCancel: function(e) {
        VegaDNSActions.redirect(
            "locationPrefixes?location_id=" + this.props.location_prefix.location_id
        );
    },


    render: function() {
        return (
            <section id="edit_location">
                <h2>Edit Location Network Prefix</h2>
                <div className="col-sm-8">
                    <form>
                        <div className="form-group">
                            <label htmlFor="location_prefix">Prefix</label>
                            <input value={this.state.prefix} onChange={this.handlePrefixChange} className="form-control" id="location_prefix" placeholder="192.168.1" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="prefix_description">Prefix Description</label>
                            <input value={this.state.prefix_description} onChange={this.handleDescriptionChange} className="form-control" id="prefix_description" placeholder="Internal network" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="prefix_type">Network Address Type</label>
                            <select type="select" onChange={this.handleTypeChange} className="form-control" id="prefix_type" value={this.state.prefix_type}>
                                <option value="ipv4">ipv4</option>
                                <option value="ipv6">ipv6</option>
                            </select>
                        </div>
                        <button type="submit" onClick={this.editLocationPrefix} className="btn btn-primary">Edit</button>
                        &nbsp;
                        <button type="submit" onClick={this.handleCancel} className="btn btn-danger">Cancel</button>
                    </form>
                </div>
            </section>
        );
    }
});

module.exports = LocationPrefixEditForm;
