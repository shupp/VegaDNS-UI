var React = require('react');
var createClass = require('create-react-class');
var Logo = require('./Logo.react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSClient = require('../utils/VegaDNSClient');

var PasswordReset = React.createClass({
    getInitialState: function() {
        return {
            password1: "",
            password2: "",
            checkingTokenStatus: true,
            tokenIsValid: false,
            showSuccessStatus: false,
        }
    },

    componentWillMount: function() {
        this.checkTokenStatus();
    },

    handlePassword1Change: function(e) {
        this.setState({
            password1: e.target.value
        });
    },

    handlePassword2Change: function(e) {
        this.setState({
            password2: e.target.value
        });
    },

    checkTokenStatus: function () {
        if (typeof this.props.params.token != 'undefined'
            && this.props.params.token.length == 64) {

            VegaDNSClient.passwordResetTokenCheck(this.props.params.token).success(data => {
                this.setState({tokenIsValid: true});
            });
        }
        this.setState({checkingTokenStatus: false});
    },

    passwordReset: function(e) {
        e.preventDefault();

        /* FIXME password criteria */

        /* Check that passwords are present and match */
        if (this.state.password1.length <= 0) {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Please enter a password"
            );
            return;
        }
        if (this.state.password2.length <= 0) {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Please confirm your password"
            );
            return;
        }
        if (this.state.password1 != this.state.password2) {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Passwords do not match"
            );
            return;
        }

        VegaDNSClient.passwordReset(this.state.password1, this.props.params.token).success(data => {
            this.setState({showSuccessStatus: true});
            /* FIXME rate limiting */
        }).error(data => {
            var message = "Error resetting password";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    },

    render: function() {
        var passwordResetForm = <form className="form-signin">
            <h4 className="form-signin-heading">Please enter and confirm your new password</h4>
            <label htmlFor="password1" className="sr-only">New Password</label>
            <input type="password" onChange={this.handlePassword1Change} id="password1" className="form-control" placeholder="New Password" autoFocus />
            <label htmlFor="password2" className="sr-only">Confirm New Password</label>
            <input type="password" onChange={this.handlePassword2Change} id="password2" className="form-control" placeholder="Confirm New Password" autoFocus />
            <button className="btn btn-lg btn-primary btn-block" onClick={this.passwordReset} type="submit">Submit</button>
            <div style={{marginTop: "10px"}}><a href="#">Back to log in</a></div>
        </form>

        var checkingToken = <form className="form-signin">
            <h4 className="form-signin-heading">Validating reset token, please wait</h4>
            <a href="#">Back to log in</a>
        </form>

        var invalidToken = <form className="form-signin">
            <h4 className="form-signin-heading">Invalid or mising token</h4>
            <a href="#">Back to log in</a>
        </form>

        var successStatus = <form className="form-signin">
            <h4 className="form-signin-heading">Password reset successful.  Please go to the log in page below.</h4>
            <a href="#">Back to log in</a>
        </form>

        var returnValue;
        if (this.state.showSuccessStatus) {
            returnValue = successStatus;
        } else if (this.state.checkingTokenStatus) {
            returnValue = checkingToken;
        } else if (this.state.tokenIsValid == false) {
            returnValue = invalidToken;
        } else {
            returnValue = passwordResetForm;
        }

        return (
            <section id="password_reset_request">
                <Logo />
                {returnValue}
            </section>
        );
    }
});

export default PasswordReset;
