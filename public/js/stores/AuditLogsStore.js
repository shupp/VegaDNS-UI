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
var audit_logs = [];
var total_audit_logs = 0;

class AuditLogsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getAuditLogList() {
        return audit_logs;
    }

    getAuditLogTotal() {
        return total_audit_logs;
    }

    fetchAuditLogs(page, perpage, sort, order, domainIds) {
        VegaDNSClient.audit_logs(page, perpage, sort, order, domainIds)
        .success(data => {
            responseData = data;
            audit_logs = data.audit_logs;
            total_audit_logs = data.total_audit_logs;
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

    addRefreshChangeListener(callback) {
        this.on(REFRESH_CHANGE_CONSTANT, callback);
    }

    removeRefreshChangeListener(callback) {
        this.removeListener(REFRESH_CHANGE_CONSTANT, callback);
    }
}

var store = new AuditLogsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_AUDIT_LOGS:
            store.fetchAuditLogs(
                action.page,
                action.perpage,
                action.sort,
                action.order,
                action.domainIds
            );
            break;
    }
});

module.exports = store;
