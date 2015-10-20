"use strict";

var VegaDNSClient = require('../utils/VegaDNSClient');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

import { EventEmitter } from 'events';

var CHANGE_CONSTANT = 'CHANGE';
var REFRESH_CHANGE_CONSTANT = 'REFRESH';

var responseData = null;
var domaingroupmaps = [];

class DomainGroupMapsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getDomainGroupMapList() {
        return domaingroupmaps;
    }

    fetchDomainGroupMaps(groupId) {
        VegaDNSClient.domaingroupmaps(groupId)
        .success(data => {
            responseData = data;
            domaingroupmaps = data.domaingroupmaps;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    addDomainGroupMap(group, domain, permissions) {
        VegaDNSClient.addDomainGroupMap(group.group_id, domain.domain_id, permissions)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                domain.domain + " added to group \"" + group.name + "\" successfully",
                true
            );
            this.fetchDomainGroupMaps(group.group_id)
        }).error(data => {
            var message = "Adding domain to group failed for an unknown reason";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    editDomainGroupMap(domaingroupmapId, permissions) {
        VegaDNSClient.editDomainGroupMap(domaingroupmapId, permissions)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Group permissions on domain updated successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Group permissions update on domain failed";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    deleteDomainGroupMap(domaingroupmap) {
        VegaDNSClient.deleteDomainGroupMap(domaingroupmap.map_id)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Domain removed from group successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Domain removal from group failed";
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

var store = new DomainGroupMapsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_DOMAIN_GROUP_MAPS:
            store.fetchDomainGroupMaps(action.groupId);
            break;
        case VegaDNSConstants.ADD_DOMAIN_GROUP_MAP:
            store.addDomainGroupMap(action.group, action.domain, action.permissions);
            break;
        case VegaDNSConstants.EDIT_DOMAIN_GROUP_MAP:
            store.editDomainGroupMap(action.domaingroupmapId, action.permissions);
            break;
        case VegaDNSConstants.DELETE_DOMAIN_GROUP_MAP:
            store.deleteDomainGroupMap(action.domaingroupmap);
            break;
    }
});

module.exports = store;
