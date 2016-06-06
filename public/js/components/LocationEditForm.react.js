var React = require('react');
var LocationsStore = require('../stores/LocationsStore');
var VegaDNSActions = require('../actions/VegaDNSActions');

var LocationEditForm = React.createClass({
    getInitialState: function() {
        return {
            location: this.props.location.location,
            location_description: this.props.location.location_description
        }
    },

    handleLocationChange: function(e) {
        this.setState({
            location: e.target.value
        });
    },

    handleDescriptionChange: function(e) {
        this.setState({
            location_description: e.target.value
        });
    },

    editLocation: function(e) {
        e.preventDefault();

        VegaDNSActions.editLocation(
            this.props.location.location_id,
            this.state.location,
            this.state.location_description
        );
    },


    render: function() {
        return (
            <section id="edit_location">
                <h2>Edit Location</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="location_name">Location (two characters)</label>
                        <input value={this.state.location} onChange={this.handleLocationChange} className="form-control" id="location_name" placeholder="ex" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location_description">Location Description</label>
                        <input value={this.state.location_description} onChange={this.handleDescriptionChange} className="form-control" id="apikey_description" placeholder="Description" />
                    </div>
                    <button type="submit" onClick={this.editLocation} className="btn btn-primary">Edit</button>
                    &nbsp;
                    <button type="submit" onClick={this.props.cancelCallback} className="btn btn-danger">Cancel</button>
                </form>
            </section>
        );
    }
});

module.exports = LocationEditForm;
