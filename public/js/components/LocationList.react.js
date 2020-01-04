var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');
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
        this.setState({
            showAddForm: false,
            locations: []
        });

        VegaDNSClient.locations()
        .success(data => {
            this.setState({
                locations: data.locations
            });
        }).error(data => {
            VegaDNSActions.errorNotifcation(
                "Unable to retrieve locations: ",
                data
            );
        });
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
                    listCallback={this.listLocations}
                />
            );
        }

        var addLocationForm =
            <div className="row">
                <div className="col-xs-12">
                    <div className="col-xs-offset-4 col-xs-4">
                        <LocationAddForm listCallback={this.listLocations} hideCallback={this.hideAddLocationForm} />
                    </div>
                </div>
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

export default LocationList;
