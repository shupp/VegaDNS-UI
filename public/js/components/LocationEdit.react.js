var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LocationEditForm = require('./LocationEditForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var LocationEdit = React.createClass({
    getInitialState: function() {
        return {
            location: {}
        }
    },

    componentWillMount: function() {
        this.getLocation();
    },

    getLocation: function() {
        VegaDNSClient.getLocation(this.props.params["location_id"])
        .success(data => {
            this.setState({
                location: data.location
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Location not found: ",
                data
            );
        });
    },

    handleCancel: function() {
        VegaDNSActions.redirect("locations");
    },

    render: function() {
        if (Object.keys(this.state.location).length) {
            return (
                <section id="location_edit">
                    <LocationEditForm key={this.state.location.location_id} location={this.state.location} cancelCallback={this.handleCancel} />
                </section>
            );
        }
        return (
            <section id="location_edit"></section>
        );

    }
});

module.exports = LocationEdit;
