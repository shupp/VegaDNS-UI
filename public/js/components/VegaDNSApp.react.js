var LogIn = require('./LogIn.react');
var MainSection = require('./MainSection.react');
var React = require('react');
var LogInStore = require('../stores/LogInStore');

var VegaDNSApp = React.createClass({
  getInitialState: function() {
    return {
        loggedIn: false
    }
  },

  componentDidMount: function() {
    LogInStore.addChangeListener(this.onChange);
  },

  onChange() {
    this.setState({loggedIn: LogInStore.isLoggedIn()});
  },

  render: function() {
    if (this.state.loggedIn == false) {
        return (
          <div>
            <LogIn />
          </div>
        );
    } else {
        return (
          <div>
            <MainSection />
          </div>
        );
    }
  }

});

module.exports = VegaDNSApp;
