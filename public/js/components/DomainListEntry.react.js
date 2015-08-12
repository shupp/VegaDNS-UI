var React = require('react');
var ReactPropTypes = React.PropTypes;

var DomainListEntry = React.createClass({
  propTypes: {
   domain: ReactPropTypes.object.isRequired
  },

  render: function() {
      var domain = this.props.domain;
      return (
        <tr>
            <td>{domain.domain_id}</td>
            <td>{domain.domain}</td>
            <td>{domain.status}</td>
        </tr>
      );
  }
});

module.exports = DomainListEntry;
