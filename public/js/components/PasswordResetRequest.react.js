var React = require('react');
var createClass = require('create-react-class');
var Logo = require('./Logo.react');
var VegaDNSActions = require('../actions/VegaDNSActions');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSClient = require('../utils/VegaDNSClient');

var PasswordResetRequest = createClass({
    getInitialState: function() {
        return {
            email: "",
            showSuccessStatus: false,
        }
    },

    handleEmailChange: function(e) {
        this.setState({
            email: e.target.value
        });
    },

    requestPasswordReset: function(e) {
        e.preventDefault();
        VegaDNSClient.passwordResetRequest(this.state.email).success(data => {
            this.setState({showSuccessStatus: true});
            /* FIXME rate limiting */
        }).error(data => {
            var message = "Error requesting password reset";
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
        var emailForm = <form className="form-signin">
            <h4 className="form-signin-heading">Please enter your email address to reset your password</h4>
            <label htmlFor="inputEmail" className="sr-only">Email address</label>
            <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email address" autoFocus />
            <button className="btn btn-lg btn-primary btn-block" onClick={this.requestPasswordReset} type="submit">Submit</button>
            <div style={{marginTop: "10px"}}><a href="#">Back to log in</a></div>
        </form>

        var successStatus = <form className="form-signin">
            <h4 className="form-signin-heading">Password reset request sent.  Please check your email to reset it.</h4>
            <a href="#">Back to log in</a>
        </form>

        return (
            <section id="password_reset_request">
                <Logo />
                {this.state.showSuccessStatus ? successStatus : emailForm}
            </section>
        );
    }
});

export default PasswordResetRequest;
