var React = require('react');
var createClass = require('create-react-class');
var VegaDNSActions = require('../actions/VegaDNSActions');

var PagerInnerPage = React.createClass({
    render: function() {
        if (this.props.page == this.props.currentPage) {
            return (
                <li className="active">
                    <a href={this.props.url}> {this.props.page} <span className="sr-only">(current)</span>
                    </a>
                </li>
            );
        } else {
            return (
                <li>
                    <a href={this.props.url}> {this.props.page} </a>
                </li>
            );
        }
    }
});

export default PagerInnerPage;
