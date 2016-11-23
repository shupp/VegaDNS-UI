var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LocationPrefixEditForm = require('./LocationPrefixEditForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var LocationPrefixEdit = React.createClass({
    getInitialState: function() {
        return {
            location_prefix: {}
        }
    },

    componentWillMount: function() {
        this.getLocationPrefix();
    },

    getLocationPrefix: function() {
        VegaDNSClient.getLocationPrefix(this.props.params["prefix_id"])
        .success(data => {
            this.setState({
                location_prefix: data.location_prefix
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve location prefix: ",
                data
            );
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("locationPrefixes?location_id=" + this.props.params["location_id"]);
    },

    render: function() {
        if (Object.keys(this.state.location_prefix).length) {
            return (
                <section id="location_prefix_edit">
                    <LocationPrefixEditForm key={this.state.location_prefix.prefix_id} location_prefix={this.state.location_prefix} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="location_prefix_edit"></section>
        );

    }
});

module.exports = LocationPrefixEdit;
