var React = require('react');
var createClass = require('create-react-class');
var LogInStore = require('../stores/LogInStore');
var LogIn = require('./LogIn.react');
var HeaderSection = require('./HeaderSection.react');
var DomainList = require('./DomainList.react');
var ApiKeyList = require('./ApiKeyList.react');
var RecordList = require('./RecordList.react');
var DefaultRecordList = require('./DefaultRecordList.react');
var AccountList = require('./AccountList.react');
var AccountEdit = require('./AccountEdit.react');
var GroupList = require('./GroupList.react');
var LocationList = require('./LocationList.react');
var LocationEdit = require('./LocationEdit.react');
var LocationPrefixList = require('./LocationPrefixList.react');
var LocationPrefixEdit = require('./LocationPrefixEdit.react');
var AuditLogList = require('./AuditLogList.react');
var GroupEdit = require('./GroupEdit.react');
var RecordEdit = require('./RecordEdit.react');
var DefaultRecordEdit = require('./DefaultRecordEdit.react');
var RecordEditSOA = require('./RecordEditSOA.react');
var DefaultRecordEditSOA = require('./DefaultRecordEditSOA.react');
var MyAccountEdit = require('./MyAccountEdit.react');
var DomainOwnerEdit = require('./DomainOwnerEdit.react');
var PasswordResetRequest = require('./PasswordResetRequest.react');
var PasswordReset = require('./PasswordReset.react');
var About = require('./About.react');
var Redirect = require('../utils/Redirect');

var VegaDNSApp = React.createClass({
    getInitialState: function() {
        return {
            loggedIn: false,
            account: null
        }
    },

    componentWillMount: function() {
        LogInStore.checkLoginState()
    },

    componentDidMount: function() {
        LogInStore.addChangeListener(this.onChange);
    },

    onChange() {
        this.setState({
            loggedIn: LogInStore.isLoggedIn(),
            account: LogInStore.getAccount()
        });
    },

    getRoute() {
        var Route = "";
        if (this.props.route != undefined) {
            var RouteParts = this.props.route.split("?");
            var Route = RouteParts[0];
        }

        return Route;
    },

    getParams() {
        var Params = {};

        if (this.props.route != undefined) {
            var RouteParts = this.props.route.split("?");
            var Route = RouteParts[0];

            // Parse out faux query string within fragment
            if (RouteParts.length > 1) {
                var Route = RouteParts[0];
                var QueryString = RouteParts[1];

                var Pairs = QueryString.split("&");
                for (var i = 0; i < Pairs.length; i++) {
                    var pair = Pairs[i].split("=");
                    if (pair.length == 1) {
                        Params[pair[0]] = null;
                    } else {
                        Params[pair[0]] = pair[1];
                    }
                }
            }
        }

        return Params;
    },

    render: function() {
        var Route = this.getRoute();
        var Params = this.getParams();
        var Child;
        var Key = Route;

        if (this.state.loggedIn == false) {
            switch (Route) {
                case 'passwordResetRequest':
                    Child = PasswordResetRequest;
                    break;
                case 'passwordReset':
                    Child = PasswordReset;
                    break;
                default:
                    Key = "LogIn";
                    Child = LogIn;
                    break;
            }

            return (
                <div>
                    <Child key={Key} route={Route} params={Params} />
                </div>
            );
        } else {
            switch (Route) {
                case 'records':
                    Child = RecordList;
                    break;
                case 'defaultRecords':
                    Child = DefaultRecordList;
                    break;
                case 'defaultRecordEdit':
                    Child = DefaultRecordEdit;
                    break;
                case 'apikeys':
                    Child = ApiKeyList;
                    break;
                case 'accounts':
                    Child = AccountList;
                    break;
                case 'accountEdit':
                    Child = AccountEdit;
                    break;
                case 'myAccountEdit':
                    Child = MyAccountEdit;
                    break;
                case 'groups':
                    Child = GroupList;
                    break;
                case 'groupEdit':
                    Child = GroupEdit;
                    break;
                case 'recordEdit':
                    Child = RecordEdit;
                    break;
                case 'domainOwnerEdit':
                    Child = DomainOwnerEdit;
                    break;
                case 'recordEditSOA':
                    Child = RecordEditSOA;
                    break;
                case 'defaultRecordEditSOA':
                    Child = DefaultRecordEditSOA;
                    break;
                case 'locations':
                    Child = LocationList;
                    break;
                case 'locationEdit':
                    Child = LocationEdit;
                    break;
                case 'locationPrefixes':
                    Child = LocationPrefixList;
                    break;
                case 'locationPrefixEdit':
                    Child = LocationPrefixEdit;
                    break;
                case 'auditLogs':
                    Child = AuditLogList;
                    break;
                case 'about':
                    Child = About;
                    break;
                case 'domains':
                default:
                    Child = DomainList;
            }

            return (
                <div>
                    <section id="header">
                        <div className="row">
                            <HeaderSection route={Route} account={this.state.account}/>
                        </div>
                    </section>
                    <section id="main">
                        <div>
                            <Child key={window.location.hash} route={Route} params={Params} account={this.state.account}/>
                        </div>
                    </section>
                </div>
            );
        }
    }
});

export default VegaDNSApp;
