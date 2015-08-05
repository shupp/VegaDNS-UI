var MainSection = require('./MainSection.react');
var React = require('react');
var VegaDNSStore = require('../stores/VegaDNSStore');

var VegaDNSApp = React.createClass({

  getInitialState: function() {
    return {
        loggedIn: false,
        resources: {}
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
