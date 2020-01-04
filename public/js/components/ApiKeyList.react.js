var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var ApiKeyListEntry = require('./ApiKeyListEntry.react');
var ApiKeyAddForm = require('./ApiKeyAddForm.react');
var VegaDNSClient = require('../utils/VegaDNSClient');

var ApiKeyList = React.createClass({
    getInitialState: function() {
        return {
            apikeys: [],
            showAddForm: false
        }
    },

    showAddKeyForm: function() {
        this.setState({showAddForm: true});
    },

    hideAddKeyForm: function() {
        this.setState({showAddForm: false});
    },

    componentWillMount: function() {
        this.listApiKeys();
    },

    listApiKeys: function() {
        this.setState({
            showAddForm: false,
            apikeys: []
        });

        VegaDNSClient.apikeys(this.props.account.account_id)
        .success(data => {
            this.setState({
                apikeys: data.apikeys
            });
        }).error(data => {
            VegaDNSActions.errorNotification(
                "Unable to retrieve apikeys: ",
                data
            );
        });
    },

    render: function() {
        var apikeys = [];

        for (var key in this.state.apikeys) {
            apikeys.push(<ApiKeyListEntry key={key} apikey={this.state.apikeys[key]} listCallback={this.listApiKeys} />);
        }

        var addKeyForm = 
            <div className="row">
                <div className="col-md-12">
                    <ApiKeyAddForm hideCallback={this.hideAddKeyForm} listCallback={this.listApiKeys} />
                </div>
            </div>
        var keyList = 
            <div>
                <div className="row">
                    <div className="col-md-12 text-center">
                        <h2>API Keys</h2>
                        <div className="pull-right">
                            <a className="btn btn-primary" onClick={this.showAddKeyForm} role="button">add</a>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <table className="table table-hover break-word">
                        <thead>
                            <tr>
                                <th>description</th>
                                <th>key</th>
                                <th>secret</th>
                                <th>delete</th>
                                <th className="hidden-sm hidden-xs">id</th>
                            </tr>
                        </thead>
                        <tbody>
                            {apikeys}
                        </tbody>
                    </table>
                </div>
            </div>

        return (
            <section id="apikeys">
                {this.state.showAddForm  ? addKeyForm : keyList}
            </section>
        );
    }
});

export default ApiKeyList;
