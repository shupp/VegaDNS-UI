var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');

var HeaderSection = React.createClass({
  render: function() {

      return (
        <div className="dropdown">
            <button className="btn btn-default dropdown-toggle" type="button" id="your-account-menu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                Your Account <span className="caret"></span>
            </button>
            <ul className="dropdown-menu" aria-labelledby="your-account-menu">
                <li><a href="#" onClick={this.submitLogOut}>Sign Out</a></li>
            </ul>
        </div>
      );
  },

  submitLogOut: function(e) {
    e.preventDefault();
    VegaDNSActions.logout();
  }
});

module.exports = HeaderSection;
