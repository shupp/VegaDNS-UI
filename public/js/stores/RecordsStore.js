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
var records = [];
var domain = null;
var total_records = 0;

class RecordsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getRecordList() {
        return records;
    }

    getDomain() {
        return domain;
    }

    getRecordTotal() {
        return total_records;
    }

    fetchRecords(domain_id, page, perpage, sort, order) {
        VegaDNSClient.records(domain_id, page, perpage, sort, order)
        .success(data => {
            responseData = data;
            records = data.records;
            total_records = data.total_records;
            domain = data.domain;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addRecord(payload) {
        VegaDNSClient.addRecord(payload)
        .success(data => {
            var message = data.record.record_type + " record \"" + data.record.name + "\" created successfully";
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                data.message
            );
        });
    }

    deleteRecord(recordId) {
        VegaDNSClient.deleteRecord(recordId)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Record deleted successfully"
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                data.message
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

var store = new RecordsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_RECORDS:
            store.fetchRecords(action.domainId, action.page, action.perPage, action.sort, action.order);
            break;
        case VegaDNSConstants.ADD_RECORD:
            store.addRecord(action.payload);
            break;
        case VegaDNSConstants.DELETE_RECORD:
            store.deleteRecord(action.recordId);
            break;
    }
});

module.exports = store;
