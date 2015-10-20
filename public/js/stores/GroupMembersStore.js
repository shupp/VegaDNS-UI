"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';
var REFRESH_CHANGE_CONSTANT = 'REFRESH';

var responseData = null;
var groupmembers = [];

class GroupMembersStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getGroupMemberList() {
        return groupmembers;
    }

    fetchGroupMembers(groupId) {
        VegaDNSClient.groupmembers(groupId)
        .success(data => {
            responseData = data;
            groupmembers = data.groupmembers;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addGroupMember(group, account) {
        VegaDNSClient.addGroupMember(group.group_id, account.account_id)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                account.first_name + " " + account.last_name + " added to group \"" + group.name + "\" successfully",
                true
            );
            this.fetchGroupMembers(group.group_id)
        }).error(data => {
            var message = "Adding account to group failed for an unknown reason";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    editGroupMember(groupmemberId, isAdmin) {
        VegaDNSClient.editGroupMember(groupmemberId, isAdmin)
        .success(data => {
            if (isAdmin) {
                var message = "Group member now has group admin privileges";
            } else {
                var message = "Group member no longer has group admin privileges";
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message,
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Group member admin status edit failed";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    deleteGroupMember(group, account, groupmemberId) {
        VegaDNSClient.deleteGroupMember(groupmemberId)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Groupmember deleted successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Groupmember deletion failed";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
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

var store = new GroupMembersStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_GROUP_MEMBERS:
            store.fetchGroupMembers(action.groupmemberId);
            break;
        case VegaDNSConstants.ADD_GROUP_MEMBER:
            store.addGroupMember(action.group, action.account);
            break;
        case VegaDNSConstants.EDIT_GROUP_MEMBER:
            store.editGroupMember(action.groupmemberId, action.isAdmin);
            break;
        case VegaDNSConstants.DELETE_GROUP_MEMBER:
            store.deleteGroupMember(action.group, action.account, action.groupmemberId);
            break;
    }
});

module.exports = store;
