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
    addDomain: function(domain) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_DOMAIN,
            domain: domain
        });
    },
    deleteDomain: function(domain) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_DOMAIN,
            domain: domain
        });
    },
    listRecords: function(domainId, page, perPage, sort, order) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_RECORDS,
            domainId: domainId,
            page: page,
            perPage: perPage,
            sort: sort,
            order: order
        });
    },
    addRecord: function(payload) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_RECORD,
            payload: payload
        });
    },
    listApiKeys: function(accountIds) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_APIKEYS,
            accountIds: accountIds
        });
    },
    addApiKey: function(accountId, description) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_APIKEY,
            accountId: accountId,
            description: description
        });
    },
    deleteApiKey: function(apiKeyId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_APIKEY,
            apiKeyId: apiKeyId
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
