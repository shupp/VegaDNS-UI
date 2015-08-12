var React = require('react');
var ReactPropTypes = React.PropTypes;

var MainSection = React.createClass({
  render: function() {

      return (
      <section id="main">

      <h1 className="vegadns-logo">VegaDNS</h1>
        <h3>I'm logged in!</h3>
      </section>
      );
  },
});

module.exports = MainSection;
