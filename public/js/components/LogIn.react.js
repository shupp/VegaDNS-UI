var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');

var LogIn = React.createClass({
  handleEmailChange: function(e) {
    this.setState({email: e.target.value});
  },

  handlePasswordChange: function(e) {
    this.setState({password: e.target.value});
  },

  render: function() {

      return (
      <section id="login">

      <h1 className="vegadns-logo">VegaDNS</h1>
      <form className="form-signin">
        <h2 className="form-signin-heading">Please sign in</h2>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" onChange={this.handleEmailChange} id="inputEmail" className="form-control" placeholder="Email address" autofocus />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" onChange={this.handlePasswordChange} id="inputPassword" className="form-control" placeholder="Password" required />
        {/* <div className="checkbox">
          <label>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>
        </div> */}
        <button className="btn btn-lg btn-primary btn-block" onClick={this.submitLogIn} type="submit">Sign in</button>
      </form>
      </section>
      );
  },

  submitLogIn: function(e) {
    e.preventDefault();
    VegaDNSActions.login(this.state.email, this.state.password);
  }
});

module.exports = LogIn;
