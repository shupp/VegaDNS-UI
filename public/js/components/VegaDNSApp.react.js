var MainSection = require('./MainSection.react');
var React = require('react');

var VegaDNSApp = React.createClass({

  getInitialState: function() {
    return {
        loggedIn: false
    }
  },

  componentDidMount: function() {
    {}
  },

  componentWillUnmount: function() {
    {}
  },

  render: function() {
    return (
      <div>
        <MainSection />
      </div>
    );
  },

  _onChange: function() {
    this.setState({loggedIn: true});
  }

});

module.exports = VegaDNSApp;
