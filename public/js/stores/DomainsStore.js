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
var domains = [];

class DomainsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getDomainList() {
        return domains;
    }

    fetchDomains(search) {
        VegaDNSClient.domains(search)
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
                "Domain created successfully",
                true
            );
            VegaDNSActions.redirect("records?domain-id=" + new_id);
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Domain creation was unsuccessful: " + data.responseJSON.message
            );
        });
    }

    deleteDomain(domain) {
        VegaDNSClient.deleteDomain(domain.domain_id)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Domain \"" + domain.domain + "\" deleted successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Domain deletion was unsuccessful: " + data.responseJSON.message
            );
        });
    }

    updateDomainStatus(domainId, status) {
        VegaDNSClient.updateDomainStatus(domainId, status)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Domain status updated successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Domain status update was unsuccessful: " + data.responseJSON.message
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

var store = new DomainsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_DOMAINS:
            store.fetchDomains(action.search);
            break;
        case VegaDNSConstants.ADD_DOMAIN:
            store.addDomain(action.domain);
            break;
        case VegaDNSConstants.DELETE_DOMAIN:
            store.deleteDomain(action.domain);
        case VegaDNSConstants.UPDATE_DOMAIN_STATUS:
            store.updateDomainStatus(action.domainId, action.status);
            break;
    }
});

module.exports = store;
