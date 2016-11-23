var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');

var VegaDNSActions = {
    login: function(email, password) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LOGIN,
            email: email,
            password: password
        });
    },
    logout: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LOGOUT
        });
    },
    updateLogin: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.UPDATE_LOGIN
        });
    },
    addNotification: function(messageType, message, autoDismiss) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_NOTIFICATION,
            messageType: messageType,
            message: message,
            autoDismiss: autoDismiss
        });
    },
    dismissNotification: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DISMISS_NOTIFICATION
        });
    },
    errorNotification: function(defaultMessage, data=null, autoDismiss=false) {
        if (data != null) {
            if (typeof data.responseJSON != "undefined" && typeof data.responseJSON.message !== "undefined") {
                defaultMessage += data.responseJSON.message;
            }
        }

        this.addNotification(
            VegaDNSConstants.NOTIFICATION_DANGER,
            defaultMessage,
            autoDismiss
        );
    },
    successNotification: function(message, autoDismiss=true) {
        this.addNotification(
            VegaDNSConstants.NOTIFICATION_SUCCESS,
            message,
            autoDismiss
        );
    },
    redirect: function(route) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.REDIRECT_ROUTE,
            route: route
        });
    }
};

module.exports = VegaDNSActions;
