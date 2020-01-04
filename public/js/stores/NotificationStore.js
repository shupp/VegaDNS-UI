"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';

var messageTypes = [
    VegaDNSConstants.NOTIFICATION_SUCCESS,
    VegaDNSConstants.NOTIFICATION_INFO,
    VegaDNSConstants.NOTIFICATION_WARNING,
    VegaDNSConstants.NOTIFICATION_DANGER
];
var message = "";
var messageType = null;
var autoDismiss = false;

class NotificationStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    addNotification(type, value, dismiss) {
        if (messageTypes.indexOf(type) >= 0) {
            autoDismiss = dismiss == true ? true : false;
            message = value;
            messageType = type;
            this.emitChange();
        }
    }

    addChangeListener(callback) {
        this.on(CHANGE_CONSTANT, callback);
    }

    removeChangeListener(callback) {
        this.removeListener(CHANGE_CONSTANT, callback);
    }

    getNotification() {
        return {
            messageType: messageType,
            message: message,
            autoDismiss: autoDismiss,
        }
    }

    dismissNotification() {
        messageType = null;
        message = "";
        this.emitChange();
    }
}

var store = new NotificationStore();

// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.ADD_NOTIFICATION:
            store.addNotification(action.messageType, action.message, action.autoDismiss);
            break;
        case VegaDNSConstants.DISMISS_NOTIFICATION:
            store.dismissNotification();
            break;
    }
});

export default store;
