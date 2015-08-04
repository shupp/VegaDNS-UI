var React = require('react');
var ReactPropTypes = React.PropTypes;

var MainSection = React.createClass({
  render: function() {

      return (
      <section id="main">

      <h1 className="vegadns-logo">VegaDNS</h1>
      <form className="form-signin">
        <h2 className="form-signin-heading">Please sign in</h2>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required autofocus />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required />
        <div className="checkbox">
          <label>
            <input type="checkbox" value="remember-me" /> Remember me
          </label>
        </div>
        <button className="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
      </form>
      </section>
      );
  },
});

module.exports = MainSection;
