"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';
var REFRESH_CHANGE_CONSTANT = 'REFRESH';

var responseData = null;
var accounts = [];
var account = {};

class AccountsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getAccountList() {
        return accounts;
    }

    getAccount() {
        return account;
    }

    fetchAccount(accountId) {
        VegaDNSClient.getAccount(accountId)
        .success(data => {
            responseData = data;
            account = data.account;
            this.emitChange();
        }).error(data => {
            var message = "Account not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    fetchAccounts() {
        VegaDNSClient.accounts()
        .success(data => {
            responseData = data;
            accounts = data.accounts;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addAccount(account) {
        VegaDNSClient.addAccount(account)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Account " + account.email + " created successfully"
            );
            this.fetchAccounts()
        }).error(data => {
            var message = "Account creation failed for an unknown reason";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    editAccount(account) {
        VegaDNSClient.editAccount(account)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Account " + account.email + " updated successfully"
            );
            VegaDNSActions.redirect("accounts");
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Account edit failed"
            );
        });
    }

    deleteAccount(account) {
        VegaDNSClient.deleteAccount(account.account_id)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Account " + account.email + " deleted successfully"
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Account deletion failed"
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

var store = new AccountsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_ACCOUNTS:
            store.fetchAccounts();
            break;
        case VegaDNSConstants.GET_ACCOUNT:
            store.fetchAccount(action.accountId);
            break;
        case VegaDNSConstants.ADD_ACCOUNT:
            store.addAccount(action.account);
            break;
        case VegaDNSConstants.EDIT_ACCOUNT:
            store.editAccount(action.account);
            break;
        case VegaDNSConstants.DELETE_ACCOUNT:
            store.deleteAccount(action.account);
            break;
    }
});

module.exports = store;
