"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';
var REFRESH_CHANGE_CONSTANT = 'REFRESH';

var responseData = null;
var groups = [];
var group = {};

class GroupsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getGroupList() {
        return groups;
    }

    getGroup() {
        return group;
    }

    fetchGroup(groupId) {
        VegaDNSClient.getGroup(groupId)
        .success(data => {
            responseData = data;
            group = data.group;
            this.emitChange();
        }).error(data => {
            var message = "Group not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    fetchGroups() {
        VegaDNSClient.groups()
        .success(data => {
            responseData = data;
            groups = data.groups;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addGroup(group) {
        VegaDNSClient.addGroup(group)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Group \"" + group.name + "\" created successfully",
                true
            );
            this.fetchGroups()
        }).error(data => {
            var message = "Group creation failed for an unknown reason";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    editGroup(group) {
        VegaDNSClient.editGroup(group)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Group \"" + group.name + "\" updated successfully",
                true
            );
        }).error(data => {
            var message = "Group edit failed for an unknown reason";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    deleteGroup(group) {
        VegaDNSClient.deleteGroup(group.group_id)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Group \"" + group.name + "\" deleted successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                "Group deletion failed"
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

var store = new GroupsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_GROUPS:
            store.fetchGroups();
            break;
        case VegaDNSConstants.GET_GROUP:
            store.fetchGroup(action.groupId);
            break;
        case VegaDNSConstants.ADD_GROUP:
            store.addGroup(action.group);
            break;
        case VegaDNSConstants.EDIT_GROUP:
            store.editGroup(action.group);
            break;
        case VegaDNSConstants.DELETE_GROUP:
            store.deleteGroup(action.group);
            break;
    }
});

module.exports = store;
