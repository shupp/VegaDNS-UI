"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';
var REFRESH_CHANGE_CONSTANT = 'REFRESH';

var loggedInState = false;
var responseData = null;
var apikeys = [];

class ApiKeysStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getApiKeyList() {
        return apikeys;
    }

    fetchApiKeys(accountIds) {
        VegaDNSClient.apikeys(accountIds)
        .success(data => {
            responseData = data;
            apikeys = data.apikeys;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addApiKey(accountId, description) {
        VegaDNSClient.addApiKey(accountId, description)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "API key created successfully"
            );
            this.fetchApiKeys(accountId)
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "API key creation failed"
            );
        });
    }

    deleteApiKey(apiKeyId) {
        VegaDNSClient.deleteApiKey(apiKeyId)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "API key deleted successfully"
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "API key deletion failed"
            );
        });
    }

    addChangeListener(callback) {
        this.on(CHANGE_CONSTANT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_CONSTANT, callback);
    }

    addRefreshChangeListener(callback) {
        this.on(REFRESH_CHANGE_CONSTANT, callback);
    }

    removeRefreshChangeListener(callback) {
        this.removeListener(REFRESH_CHANGE_CONSTANT, callback);
    }
}

var store = new ApiKeysStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_APIKEYS:
            store.fetchApiKeys(action.accountIds);
            break;
        case VegaDNSConstants.ADD_APIKEY:
            store.addApiKey(action.accountId, action.description);
            break;
        case VegaDNSConstants.DELETE_APIKEY:
            store.deleteApiKey(action.apiKeyId);
            break;
    }
});

module.exports = store;
