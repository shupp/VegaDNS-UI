var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LocationsStore = require('../stores/LocationsStore');
var LocationListEntry = require('./LocationListEntry.react');
var VegaDNSClient = require('../utils/VegaDNSClient');
var LocationAddForm = require('./LocationAddForm.react');

var LocationList = React.createClass({
    getInitialState: function() {
        return {
            showAddForm: false,
            locations: []
        }
    },

    componentWillMount: function() {
        this.listLocations();
    },

    listLocations: function() {
        VegaDNSActions.listLocations();
    },

    componentDidMount: function() {
        LocationsStore.addChangeListener(this.onChange);
        LocationsStore.addRefreshChangeListener(this.onRefreshChange);
    },

    componentWillUnmount: function() {
        LocationsStore.removeChangeListener(this.onChange);
        LocationsStore.removeRefreshChangeListener(this.onRefreshChange);
    },

    onChange() {
        this.setState({
            showAddForm: false,
            locations: LocationsStore.getLocationList()
        });
    },

    onRefreshChange() {
        this.listLocations();
    },

    showAddLocationForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddLocationForm: function() {
        this.setState({showAddForm: false});
    },


    render: function() {
        var locations = [];

        for (var key in this.state.locations) {
            locations.push(
                <LocationListEntry
                    key={key}
                    location_entry={this.state.locations[key]}
                    account={this.props.account}
                />
            );
        }

        var addLocationForm =
            <div className="row">
                <LocationAddForm hideCallback={this.hideAddLocationForm} />
            </div>

        var addButton = <a className="btn btn-primary" onClick={this.showAddLocationForm} role="button">add</a>
        if (this.props.account.account_type != "senior_admin") {
            addButton = <a className="btn btn-primary" role="button" disabled="disabled">add</a>
        }

        var locationList = 
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="text-center">Locations</h2>
                    </div>
                    <div className="col-md-12 text-right">
                        {addButton}
                    </div>
                </div>
                <div className="col-md-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>location</th>
                                <th>description</th>
                                <th>edit</th>
                                <th>delete</th>
                                <th>id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations}
                        </tbody>
                    </table>
                </div>
            </div>

        return (
            <section id="locations">
                {this.state.showAddForm  ? addLocationForm : locationList}
            </section>
        );
    }
});

module.exports = LocationList;
