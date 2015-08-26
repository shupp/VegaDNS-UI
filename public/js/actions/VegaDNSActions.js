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
    listDomains: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_DOMAINS
        });
    },
    listRecords: function(domainId, page, perPage) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_RECORDS,
            domainId: domainId,
            page: page,
            perPage: perPage
        });
    },
    addNotification: function(messageType, message) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_NOTIFICATION,
            messageType: messageType,
            message: message
        });
    },
    dismissNotification: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DISMISS_NOTIFICATION
        });
    }
};

module.exports = VegaDNSActions;
