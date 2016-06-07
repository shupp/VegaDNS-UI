var React = require('react');
var ApiKeysStore = require('../stores/ApiKeysStore');
var VegaDNSActions = require('../actions/VegaDNSActions');

var ApiKeyAddForm = React.createClass({
    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    addKey: function(e) {
        VegaDNSActions.addApiKey(this.props.account_id, this.state.description);
        this.props.hideCallback();
    },

    render: function() {
        return (
            <section id="add_api_key">
                <h2>Create a new API Key</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="apikey_description">API Key Description</label>
                        <input onChange={this.handleDescriptionChange} className="form-control" id="apikey_description" placeholder="Description" />
                    </div>
                    <button type="submit" onClick={this.addKey} className="btn btn-primary">Create</button>
                    &nbsp;
                    <button type="submit" onClick={this.props.hideCallback} className="btn btn-danger">Cancel</button>
                </form>
            </section>
        );
    }
});

module.exports = ApiKeyAddForm;
