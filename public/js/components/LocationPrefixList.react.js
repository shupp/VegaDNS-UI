var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LocationPrefixListEntry = require('./LocationPrefixListEntry.react');
var VegaDNSClient = require('../utils/VegaDNSClient');
var LocationPrefixAddForm = require('./LocationPrefixAddForm.react');

var LocationPrefixList = React.createClass({
    getInitialState: function() {
        return {
            showAddForm: false,
            locationPrefixes: [],
            location: {},
        }
    },

    componentWillMount: function() {
        this.listLocationPrefixes();
    },

    listLocationPrefixes: function() {
        this.setState({
            showAddForm: false,
            location: {},
            locationPrefixes: []
        });

        VegaDNSClient.locationPrefixes(this.props.params["location_id"])
        .success(data => {
            this.setState({
                location: data.location,
                locationPrefixes: data.location_prefixes
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve location prefixes: ",
                data
            );
        });
    },

    showAddLocationPrefixForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddLocationPrefixForm: function() {
        this.setState({showAddForm: false});
    },


    render: function() {
        var locationPrefixes = [];

        for (var key in this.state.locationPrefixes) {
            locationPrefixes.push(
                <LocationPrefixListEntry
                    key={key}
                    location_prefix={this.state.locationPrefixes[key]}
                    location={this.state.location}
                    account={this.props.account}
                    listCallback={this.listLocationPrefixes}
                />
            );
        }

        var addLocationPrefixForm =
            <div className="row">
                <LocationPrefixAddForm location={this.state.location} hideCallback={this.hideAddLocationPrefixForm} listCallback={this.listLocationPrefixes} />
            </div>

        var addButton = <a className="btn btn-primary" onClick={this.showAddLocationPrefixForm} role="button">add</a>
        if (this.props.account.account_type != "senior_admin") {
            addButton = <a className="btn btn-primary" role="button" disabled="disabled">add</a>
        }

        var locationPrefixList = 
            <div>
                <div className="row">
                    <div className="col-md-12">
                        <h2 className="text-center">{"Network prefixes for location \"" + this.state.location.location + "\""}</h2>
                    </div>
                    <div className="col-md-12 text-right">
                        {addButton}
                    </div>
                </div>
                <div className="col-md-12">
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>prefix</th>
                                <th>description</th>
                                <th>type</th>
                                <th>edit</th>
                                <th>delete</th>
                                <th>id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locationPrefixes}
                        </tbody>
                    </table>
                </div>
            </div>

        return (
            <section id="location_prefixes">
                {this.state.showAddForm  ? addLocationPrefixForm : locationPrefixList}
            </section>
        );
    }
});

export default LocationPrefixList;
