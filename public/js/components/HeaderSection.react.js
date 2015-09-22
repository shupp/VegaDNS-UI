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
            <nav className="navbar navbar-inverse">
              <div className="container-fluid">
                {/*<!-- Brand and toggle get grouped for better mobile display --> */}
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                    <span className="sr-only">Toggle navigation</span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <a className="navbar-brand" href="#">VegaDNS</a>
                </div>

                {/* <!-- Collect the nav links, forms, and other content for toggling --> */}
                <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">

                  <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{account} <span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a href="#apikeys">API Keys</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#" onClick={this.submitLogOut}>Sign Out</a></li>
                      </ul>
                    </li>
                  </ul>
                </div> {/* <!-- /.navbar-collapse --> */}
              </div> {/* <!-- /.container-fluid --> */}
            </nav>
        );
    },

    submitLogOut: function(e) {
        e.preventDefault();
        window.location.hash = "";
        VegaDNSActions.logout();
    }
});

module.exports = HeaderSection;
