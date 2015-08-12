var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');

var HeaderSection = React.createClass({
  render: function() {

      return (
      <section id="logout">
        <button className="btn btn-lg btn-primary btn-block" onClick={this.submitLogOut}>Sign out</button>
      </section>
      );
  },

  submitLogOut: function(e) {
    e.preventDefault();
    VegaDNSActions.logout();
  }
});

module.exports = HeaderSection;
