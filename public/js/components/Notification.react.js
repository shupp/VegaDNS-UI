import React from 'react';
// var createClass = require('create-react-class');
var NotificationStore = require('../stores/NotificationStore');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');
var ReactCSSTransitionGroup = require('react-transition-group/CSSTransition');

export default class Notification extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            messageType: null,
            autoDismiss: false
        }
    }

    componentDidMount() {
        NotificationStore.addChangeListener(this.onChange);
    }

    onChange() {
        this.setState(NotificationStore.getNotification());
    }

    render() {
        var timeout = 4000;
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
                <div className="notification-fixed">
                    <div key="notification" id="notification" className={"alert " + bootstrapClass}>
                        <button onClick={this.handleDismissal} type="button" className="close" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                        <h4>{this.state.message}</h4>
                    </div>
                </div>


            if (this.state.autoDismiss == true) {
                setTimeout(this.handleDismissal, timeout);
            }
            window.scrollTo(0,0);
        }

        return (
            <div className="row">
                <ReactCSSTransitionGroup
                    transitionAppear={true}
                    transitionAppearTimeout={timeout}
                    transitionEnterTimeout={0}
                    transitionLeaveTimeout={0}
                    transitionName="notification-animation"
                >
                    {alert}
                </ReactCSSTransitionGroup>
            </div>
        )
    }

    handleDismissal(e) {
        VegaDNSActions.dismissNotification();
    }
}
