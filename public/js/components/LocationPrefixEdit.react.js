var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LocationPrefixesStore = require('../stores/LocationPrefixesStore');
var LocationPrefixEditForm = require('./LocationPrefixEditForm.react');

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
        VegaDNSActions.getLocationPrefix(this.props.params["prefix_id"]);
    },

    componentDidMount: function() {
        LocationPrefixesStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        LocationPrefixesStore.removeChangeListener(this.onChange);
    },

    handleCancel: function() {
        VegaDNSActions.redirect("locationPrefixes?location_id=" + this.props.params["location_id"]);
    },

    onChange() {
        this.setState({location_prefix: LocationPrefixesStore.getLocationPrefix()});
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
