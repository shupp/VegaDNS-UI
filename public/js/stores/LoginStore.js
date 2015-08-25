"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';

var loggedInState = false;
var responseData = null;

class LogInStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    login(email, password) {
        VegaDNSClient.login(email, password)
        .success(data => {
            if (data.status == "ok") {
                loggedInState = true;
                VegaDNSActions.addNotification(
                    VegaDNSConstants.NOTIFICATION_SUCCESS,
                    "Welcome to VegaDNS!"
                );
                responseData = data;
            }
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    checkLoginState() {
        var originalState = loggedInState ? true : false;

        VegaDNSClient.checkLogin()
        .success(data => {
            responseData = data;
            if (data.status == "ok") {
                loggedInState = true;
            } else {
                loggedInState = false;
            }
            if (originalState != loggedInState) {
                this.emitChange();
            }
        }).error(data => {
            this.emitChange();
        });
    }

    logout() {
        VegaDNSClient.logout()
        .success(data => {
            loggedInState = false;
            responseData = data;
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Logged out successfully"
            );
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

    isLoggedIn() {
        if (loggedInState == false) {
            this.checkLoginState();
        }
        return loggedInState;
    }

    getAccount() {
        if (loggedInState == false) {
            return null;
        }
        return responseData.account;
    }
}

var store = new LogInStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LOGIN:
            store.login(action.email, action.password);
            break;
        case VegaDNSConstants.LOGOUT:
            store.logout();
            break;
    }
});

module.exports = store;