"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';
var REFRESH_CHANGE_CONSTANT = 'REFRESH';

var responseData = null;
var defaultrecords = [];
var defaultrecord = {};
var default_soa_record = {};

class DefaultRecordsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getDefaultRecordList() {
        return defaultrecords;
    }

    getDefaultRecord() {
        return defaultrecord;
    }

    getDefaultSOARecord() {
        return default_soa_record;
    }

    fetchDefaultSOARecord() {
        VegaDNSClient.getDefaultSOARecord()
        .success(data => {
            default_soa_record = data.default_records[0];
            this.emitChange();
        }).error(data => {
            var message = "Default SOA Record not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    fetchDefaultRecord(recordId) {
        VegaDNSClient.getDefaultRecord(recordId)
        .success(data => {
            defaultrecord = data.default_record;
            this.emitChange();
        }).error(data => {
            var message = "Default Record not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    fetchDefaultRecords() {
        VegaDNSClient.defaultRecords()
        .success(data => {
            responseData = data;
            defaultrecords = data.default_records;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addDefaultRecord(payload) {
        VegaDNSClient.addDefaultRecord(payload)
        .success(data => {
            var message = "Default " + data.default_record.record_type + " record \"" + data.default_record.name + "\" created successfully";
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message,
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                data.message,
                true
            );
        });
    }

    editDefaultRecord(default_record) {
        VegaDNSClient.editDefaultRecord(default_record)
        .success(data => {
            if (default_record.record_type == "SOA") {
                var message = "Default SOA record updated successfully";
            } else {
                var message = "Default Record " + default_record.name + " updated successfully";
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message,
                true
            );
            VegaDNSActions.redirect("defaultRecords");
        }).error(data => {
            var message = "Default Record edit failed";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    deleteDefaultRecord(recordId) {
        VegaDNSClient.deleteDefaultRecord(recordId)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Default record deleted successfully",
                true
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

var store = new DefaultRecordsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_DEFAULT_RECORDS:
            store.fetchDefaultRecords();
            break;
        case VegaDNSConstants.ADD_DEFAULT_RECORD:
            store.addDefaultRecord(action.payload);
            break;
        case VegaDNSConstants.GET_DEFAULT_RECORD:
            store.fetchDefaultRecord(action.recordId);
            break;
        case VegaDNSConstants.EDIT_DEFAULT_RECORD:
            store.editDefaultRecord(action.default_record);
            break;
        case VegaDNSConstants.DELETE_DEFAULT_RECORD:
            store.deleteDefaultRecord(action.recordId);
            break;
        case VegaDNSConstants.GET_DEFAULT_SOA_RECORD:
            store.fetchDefaultSOARecord();
            break;
    }
});

module.exports = store;