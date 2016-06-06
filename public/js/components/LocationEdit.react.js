var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LocationsStore = require('../stores/LocationsStore');
var LocationEditForm = require('./LocationEditForm.react');

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
        VegaDNSActions.getLocation(this.props.params["location_id"]);
    },

    componentDidMount: function() {
        LocationsStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        LocationsStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("locations");
    },

    onChange() {
        this.setState({location: LocationsStore.getLocation()});
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
