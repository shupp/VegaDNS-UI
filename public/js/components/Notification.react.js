var React = require('react/addons');
var NotificationStore = require('../stores/NotificationStore');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var Notification = React.createClass({
    getInitialState: function() {
        return {
            message: "",
            messageType: null,
            autoDismiss: false
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
            var alert = null;
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
            var alert = 
                    <div key="notification" id="notification" className={"alert " + bootstrapClass}>
                        <button onClick={this.handleDismissal} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4>{this.state.message}</h4>
                    </div>


            if (this.state.autoDismiss == true) {
                setTimeout(this.handleDismissal, 4000);
            }
            window.scrollTo(0,0);
        }

        return (
            <ReactCSSTransitionGroup transitionAppear={true} transitionName="notification-animation">
                {alert}
            </ReactCSSTransitionGroup>
        )
    },

    handleDismissal: function(e) {
        VegaDNSActions.dismissNotification();
    }
});

module.exports = Notification;
