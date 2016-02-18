var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var ApiKeysStore = require('../stores/ApiKeysStore');
var ApiKeyListEntry = require('./ApiKeyListEntry.react');
var ApiKeyAddForm = require('./ApiKeyAddForm.react');

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
        VegaDNSActions.listApiKeys(this.props.account.account_id);
    },

    componentDidMount: function() {
        ApiKeysStore.addChangeListener(this.onChange);
        ApiKeysStore.addRefreshChangeListener(this.listApiKeys);
    },

    componentWillUnmount: function() {
        ApiKeysStore.removeChangeListener(this.onChange);
        ApiKeysStore.removeRefreshChangeListener(this.listApiKeys);
    },

    onChange() {
        this.setState({apikeys: ApiKeysStore.getApiKeyList()});
    },

    render: function() {
        var apikeys = [];

        for (var key in this.state.apikeys) {
            apikeys.push(<ApiKeyListEntry key={key} apikey={this.state.apikeys[key]} />);
        }

        var addKeyForm = 
            <div className="row">
                <div className="col-md-12">
                    <ApiKeyAddForm hideCallback={this.hideAddKeyForm} />
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
                    <table className="table table-hover table-responsive">
                        <thead>
                            <tr>
                                <th>description</th>
                                <th>key</th>
                                <th>secret</th>
                                <th>delete</th>
                                <th className="hidden-xs">id</th>
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

module.exports = ApiKeyList;
