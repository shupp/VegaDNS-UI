var React = require('react');
var createClass = require('create-react-class');
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
        this.setState({account: LogInStore.getAccount()});
    },

    render: function() {
        var account = "Your Account";
        if (this.state.account !== null) {
            account = this.state.account.email;
        }

        var menuDomains = <li><a href="#">Domains</a></li>
        var menuAccounts = null;
        var menuGroups = <li><a href="#groups">Groups</a></li>
        var menuDefaultRecords = null;
        if (this.state.account.account_type == "senior_admin") {
            var menuDefaultRecords = <li><a href="#defaultRecords">Default Records</a></li>
            var menuAccounts = <li><a href="#accounts">Accounts</a></li>
        }
        var menuLocations = <li><a href="#locations">Locations</a></li>
        var menuAuditLogs = <li><a href="#auditLogs">Audit Logs</a></li>

        switch (this.props.route) {
            case "accounts":
            case "accountEdit":
                menuAccounts = <li className="active"><a href="#accounts">Accounts <span className="sr-only">(current)</span></a></li>
                break;
            case "myAccountEdit":
                break;
            case "groups":
            case "groupEdit":
                menuGroups = <li className="active"><a href="#groups">Groups <span className="sr-only">(current)</span></a></li>
                break;
            case "defaultRecords":
            case "defaultRecordEdit":
            case "defaultRecordEditSOA":
                if (menuDefaultRecords !== null) {
                    menuDefaultRecords = <li className="active"><a href="#defaultRecords">Default Records <span className="sr-only">(current)</span></a></li>
                }
                break;
            case "locations":
            case "locationEdit":
            case "locationPrefixes":
            case "locationPrefixEdit":
                menuLocations = <li className="active"><a href="#locations">Locations <span className="sr-only">(current)</span></a></li>
                break;
            case "auditLogs":
                menuAuditLogs = <li className="active"><a href="#auditLogs">Audit Logs <span className="sr-only">(current)</span></a></li>
                break;
            case "":
            case "domains":
            default:
                menuDomains = <li className="active"><a href="#">Domains <span className="sr-only">(current)</span></a></li>
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

                    <ul className="nav navbar-nav">
                        {menuDomains}
                        {menuAccounts}
                        {menuGroups}
                        {menuDefaultRecords}
                        {menuLocations}
                        {menuAuditLogs}
                    </ul>


                  <ul className="nav navbar-nav navbar-right">
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">{account} <span className="caret"></span></a>
                      <ul className="dropdown-menu">
                        <li><a href="#apikeys">API Keys</a></li>
                        <li><a href="#myAccountEdit">My Account</a></li>
                        <li><a href="#about">About</a></li>
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

export default HeaderSection;
