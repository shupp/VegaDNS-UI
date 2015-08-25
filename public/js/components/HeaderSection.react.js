var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var LogInStore = require('../stores/LogInStore');

var HeaderSection = React.createClass({
    getInitialState: function() {
        return {account: LogInStore.getAccount()}
    },

    componentWillMount: function() {
        LogInStore.addChangeListener(this.onChange);
    },

    componentWillUnmount: function() {
        LogInStore.removeChangeListener(this.onChange);
    },

    onChange() {
        if (this.isMounted()) {
            this.setState({account: LogInStore.getAccount()});
        }
    },

    render: function() {
        var account = "Your Account";
        if (this.state.account !== null) {
            account = this.state.account.email;
        }
        return (
            <div className="dropdown">
                <button className="btn btn-default dropdown-toggle" type="button" id="your-account-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {account} <span className="caret"></span>
                </button>
                <ul className="dropdown-menu" aria-labelledby="your-account-menu">
                    <li><a href="#" onClick={this.submitLogOut}>Sign Out</a></li>
                </ul>
            </div>
        );
    },

    submitLogOut: function(e) {
        e.preventDefault();
        window.location.hash = "";
        VegaDNSActions.logout();
    }
});

module.exports = HeaderSection;
