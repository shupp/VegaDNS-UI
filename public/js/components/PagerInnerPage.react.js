var React = require('react');
var VegaDNSActions = require('../actions/VegaDNSActions');

var PagerInnerPage = React.createClass({
    handleClick: function(page) {
        this.props.callback(page);
    },

    render: function() {
        if (this.props.page == this.props.currentPage) {
            return (
                <li className="active">
                    <a href={this.props.url} onClick={this.handleClick.bind(this, this.props.page)}> {this.props.page} <span className="sr-only">(current)</span>
                    </a>
                </li>
            );
        } else {
            return (
                <li>
                    <a href={this.props.url} onClick={this.handleClick.bind(this, this.props.page)}> {this.props.page} </a>
                </li>
            );
        }
    }
});

module.exports = PagerInnerPage;
