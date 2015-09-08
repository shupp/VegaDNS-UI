"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';

var loggedInState = false;
var responseData = null;
var apikeys = [];

class ApiKeysStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
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

    addChangeListener(callback) {
        this.on(CHANGE_CONSTANT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_CONSTANT, callback);
    }
}

var store = new ApiKeysStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_APIKEYS:
            store.fetchApiKeys(action.accountIds);
            break;
    }
});

module.exports = store;
