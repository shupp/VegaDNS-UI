var React = require('react');
var ReactPropTypes = React.PropTypes;

var DomainListEntry = React.createClass({
  propTypes: {
   domain: ReactPropTypes.object.isRequired
  },

  render: function() {
      var domain = this.props.domain;
      return (
        <li>{domain.domain}</li>
      );
  }
});

module.exports = DomainListEntry;
