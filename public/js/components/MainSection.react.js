var React = require('react');
var HeaderSection = require('./HeaderSection.react');
var DomainList = require('./DomainList.react');

var MainSection = React.createClass({
  render: function() {

      return (
      <div>
          <section id="header">
              <HeaderSection />
          </section>
          <section id="main">
              <h1 className="vegadns-logo">VegaDNS</h1>
              <DomainList />
          </section>
      </div>
      );
  },
});

module.exports = MainSection;
