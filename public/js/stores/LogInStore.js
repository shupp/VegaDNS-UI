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
            if ("status" in data && data.status == "ok") {
                loggedInState = true;
                VegaDNSActions.addNotification(
                    VegaDNSConstants.NOTIFICATION_SUCCESS,
                    "Welcome to VegaDNS, " + data.account.first_name + "!",
                    true
                );
                responseData = data;
            } else {
                VegaDNSActions.addNotification(
                    VegaDNSConstants.NOTIFICATION_DANGER,
                    "Login failed"
                );
                responseData = data;
            }
            this.emitChange();
        }).error(data => {
            var message = "Something went wrong";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
            responseData = data;
        });
    }

    checkLoginState(updateData = false) {
        var originalState = loggedInState ? true : false;

        VegaDNSClient.checkLogin()
        .success(data => {
            responseData = data;
            if (data.status == "ok") {
                loggedInState = true;
            } else {
                loggedInState = false;
            }
            if (updateData) {
                this.emitChange();
            } else if (originalState != loggedInState) {
                this.emitChange();
            }
        }).error(data => {
            var message = "Something went wrong";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
            responseData = data;
        });
    }

    logout() {
        VegaDNSClient.logout()
        .success(data => {
            loggedInState = false;
            responseData = data;
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Logged out successfully",
                true
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
        case VegaDNSConstants.UPDATE_LOGIN:
            store.checkLoginState(true);
            break;
    }
});

export default store;
