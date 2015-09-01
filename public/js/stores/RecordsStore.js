"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';

var loggedInState = false;
var responseData = null;
var records = [];
var domain = null;
var total_records = 0;

class RecordsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
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

    fetchRecords(domain_id, page, perpage) {
        VegaDNSClient.records(domain_id, page, perpage)
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

    addChangeListener(callback) {
        this.on(CHANGE_CONSTANT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_CONSTANT, callback);
    }
}

var store = new RecordsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_RECORDS:
            store.fetchRecords(action.domainId, action.page, action.perPage);
            break;
    }
});

module.exports = store;
