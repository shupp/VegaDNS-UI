"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';

var loggedInState = false;
var responseData = null;
var domains = [];

class DomainsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    getDomainList() {
        return domains;
    }

    fetchDomains() {
        VegaDNSClient.domains()
        .success(data => {
            responseData = data;
            domains = data.domains;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addDomain(domain) {
        VegaDNSClient.addDomain(domain)
        .success(data => {
            var new_id = data.domain.domain_id;
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Domain created successfully"
            );
            window.location.hash = "#records?domain-id=" + new_id;
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Domain creation was unsuccessful: " + data.responseJSON.message
            );
        });
    }

    addChangeListener(callback) {
        this.on(CHANGE_CONSTANT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_CONSTANT, callback);
    }
}

var store = new DomainsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_DOMAINS:
            store.fetchDomains();
            break;
        case VegaDNSConstants.ADD_DOMAIN:
            store.addDomain(action.domain);
            break;
    }
});

module.exports = store;
