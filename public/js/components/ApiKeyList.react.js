var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var ApiKeysStore = require('../stores/ApiKeysStore');
var ApiKeyListEntry = require('./ApiKeyListEntry.react');
var ApiKeyListEntry = require('./ApiKeyListEntry.react');

var ApiKeyList = React.createClass({
    getInitialState: function() {
        return {
            apikeys: []
        }
    },

    componentWillMount: function() {
        VegaDNSActions.listApiKeys(this.props.account.account_id);
    },

    componentDidMount: function() {
        ApiKeysStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        ApiKeysStore.removeChangeListener(this.onChange);
    },

    onChange() {
        this.setState({apikeys: ApiKeysStore.getApiKeyList()});
    },

    render: function() {
        var apikeys = [];

        for (var key in this.state.apikeys) {
            apikeys.push(<ApiKeyListEntry key={key} apikey={this.state.apikeys[key]} />);
        }

        return (
            <section id="apikeys">
                <h1>API Keys</h1>
                <table className="table table-hover">
                    <thead>
                        <th>description</th>
                        <th>key</th>
                        <th>secret</th>
                        <th>id</th>
                    </thead>
                    <tbody>
                        {apikeys}
                    </tbody>
                </table>
            </section>
        );
    }
});

module.exports = ApiKeyList;
