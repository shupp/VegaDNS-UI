var React = require('react');
var createClass = require('create-react-class');
var ReactPropTypes = require('prop-types');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSClient = require('../utils/VegaDNSClient');

var ApiKeyAddForm = createClass({
    handleDescriptionChange: function(e) {
        this.setState({description: e.target.value});
    },

    propTypes: {
        listCallback: ReactPropTypes.func.isRequired,
        hideCallback: ReactPropTypes.func.isRequired
    },

    addKey: function(e) {
        VegaDNSClient.addApiKey(this.props.account_id, this.state.description)
        .success(data => {
            VegaDNSActions.successNotification(
                "API key created successfully"
            );
            this.props.listCallback();
        }).error(data => {
            VegaDNSActions.errorNotification(
                "API key creation failed: ",
                data
            );
        });
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

export default ApiKeyAddForm;
