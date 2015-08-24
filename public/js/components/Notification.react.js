var React = require('react');
var NotificationStore = require('../stores/NotificationStore');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

var Notification = React.createClass({
    getInitialState: function() {
        return {
            message: "",
            messageType: null
        }
    },

    componentDidMount: function() {
        NotificationStore.addChangeListener(this.onChange);
    },

    onChange: function() {
        this.setState(NotificationStore.getNotification());
    },

    render: function() {
        if (this.state.messageType == null) {
            return <div id="notification"></div>
        } else {
            var bootstrapClass;
            switch(this.state.messageType) {
                case VegaDNSConstants.NOTIFICATION_SUCCESS:
                    bootstrapClass = "alert-success";
                    break;
                case VegaDNSConstants.NOTIFICATION_INFO:
                    bootstrapClass = "alert-info";
                    break;
                case VegaDNSConstants.NOTIFICATION_WARNING:
                    bootstrapClass = "alert-warning";
                    break;
                case VegaDNSConstants.NOTIFICATION_DANGER:
                    bootstrapClass = "alert-danger";
                    break;
            }
            return <div id="notification" className={"alert " + bootstrapClass}>
                <button onClick={this.handleDismissal} type="button" className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
                <h4>{this.state.message}</h4>
            </div>
        }
    },

    handleDismissal: function(e) {
        VegaDNSActions.dismissNotification();
    }
});

module.exports = Notification;
