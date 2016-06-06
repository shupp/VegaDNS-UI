var React = require('react');
var LocationsStore = require('../stores/LocationsStore');
var VegaDNSActions = require('../actions/VegaDNSActions');

var LocationAddForm = React.createClass({
    getInitialState: function() {
        return {
            location: "",
            location_description: ""
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

    addLocation: function(e) {
        VegaDNSActions.addLocation(this.state.location, this.state.location_description);
    },

    render: function() {
        return (
            <section id="add_location">
                <h2>Create a new Location</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="location_name">Location (two characters)</label>
                        <input onChange={this.handleLocationChange} className="form-control" id="location_name" placeholder="ex" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="location_description">Location Description</label>
                        <input onChange={this.handleDescriptionChange} className="form-control" id="location_description" placeholder="Description" />
                    </div>
                    <button type="submit" onClick={this.addLocation} className="btn btn-primary">Create</button>
                    &nbsp;
                    <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                </form>
            </section>
        );
    }
});

module.exports = LocationAddForm;
