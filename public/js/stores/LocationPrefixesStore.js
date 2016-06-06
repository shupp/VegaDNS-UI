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
var location = {};
var locationPrefix = {};
var locationPrefixes = [];

class LocationPrefixesStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getLocationPrefixList() {
        return locationPrefixes;
    }

    getLocationPrefix() {
        return locationPrefix;
    }

    getLocation() {
        return location;
    }

    fetchLocationPrefixes(locationId) {
        VegaDNSClient.locationPrefixes(locationId)
        .success(data => {
            responseData = data;
            locationPrefixes = data.location_prefixes;
            location = data.location;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    fetchLocationPrefix(prefixId) {
        VegaDNSClient.getLocationPrefix(prefixId)
        .success(data => {
            responseData = data;
            locationPrefix = data.location_prefix;
            location = data.location;
            this.emitChange();
        }).error(data => {
            var message = "Location not found";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    addLocationPrefix(locationId, prefix, prefixDescription, prefixType) {
        VegaDNSClient.addLocationPrefix(locationId, prefix, prefixDescription, prefixType)
        .success(data => {
            var message = "Location prefix \"" + prefix + "\" added successfully";
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message,
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Unable to add prefix";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    editLocationPrefix(prefixId, prefix, prefixDescription, prefixType) {
        VegaDNSClient.editLocationPrefix(prefixId, prefix, prefixDescription, prefixType)
        .success(data => {
            var message = "Location prefix edited successfully";
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message,
                true
            );
            VegaDNSActions.redirect("locationPrefixes?location_id=" + data.location_prefix.location_id);
        }).error(data => {
            var message = "Unable to edit location prefix";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    deleteLocationPrefix(prefixId) {
        VegaDNSClient.deleteLocationPrefix(prefixId)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Location prefix deleted successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Unable to delete location prefix";
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

var store = new LocationPrefixesStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_LOCATION_PREFIXES:
            store.fetchLocationPrefixes(action.locationId);
            break;
        case VegaDNSConstants.GET_LOCATION_PREFIX:
            store.fetchLocationPrefix(action.prefixId);
            break;
        case VegaDNSConstants.ADD_LOCATION_PREFIX:
            store.addLocationPrefix(
                action.locationId, action.prefix, action.prefixDescription, action.prefixType);
            break;
        case VegaDNSConstants.EDIT_LOCATION_PREFIX:
            store.editLocationPrefix(action.prefixId, action.prefix, action.prefixDescription, action.prefixType);
            break;
        case VegaDNSConstants.DELETE_LOCATION_PREFIX:
            store.deleteLocationPrefix(action.prefixId);
            break;
    }
});

module.exports = store;
