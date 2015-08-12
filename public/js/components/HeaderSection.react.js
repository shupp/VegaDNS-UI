var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');

var HeaderSection = React.createClass({
  render: function() {

      return (
        <button className="btn btn-primary" onClick={this.submitLogOut}>Sign out</button>
      );
  },

  submitLogOut: function(e) {
    e.preventDefault();
    VegaDNSActions.logout();
  }
});

module.exports = HeaderSection;
