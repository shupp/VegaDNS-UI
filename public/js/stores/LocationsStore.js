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
var location = [];
var locations = [];

class LocationsStore extends EventEmitter {
    emitChange() {
        this.emit(CHANGE_CONSTANT);
    }

    emitRefreshChange() {
        this.emit(REFRESH_CHANGE_CONSTANT);
    }

    getLocationList() {
        return locations;
    }

    getLocation() {
        return location;
    }

    fetchLocations() {
        VegaDNSClient.locations()
        .success(data => {
            responseData = data;
            locations = data.locations;
            this.emitChange();
        }).error(data => {
            this.emitChange();
        });
    }

    fetchLocation(locationId) {
        VegaDNSClient.getLocation(locationId)
        .success(data => {
            responseData = data;
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

    addLocation(locationName, locationDescription) {
        VegaDNSClient.addLocation(locationName, locationDescription)
        .success(data => {
            var message = "Location \"" + locationName + "\" created successfully";
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message,
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Unable to create location";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    editLocation(locationId, locationName, locationDescription) {
        VegaDNSClient.editLocation(locationId, locationName, locationDescription)
        .success(data => {
            var message = "Location edited successfully";
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                message,
                true
            );
            VegaDNSActions.redirect("locations");
        }).error(data => {
            var message = "Unable to edit location";
            if (typeof data.responseJSON.message != 'undefined') {
                message = "Error: " + data.responseJSON.message;
            }
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_DANGER,
                message
            );
        });
    }

    deleteLocation(locationId) {
        VegaDNSClient.deleteLocation(locationId)
        .success(data => {
            VegaDNSActions.addNotification(
                VegaDNSConstants.NOTIFICATION_SUCCESS,
                "Location deleted successfully",
                true
            );
            this.emitRefreshChange();
        }).error(data => {
            var message = "Unable to delete location";
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

var store = new LocationsStore();


// Register callback to handle all updates
AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.LIST_LOCATIONS:
            store.fetchLocations();
            break;
        case VegaDNSConstants.GET_LOCATION:
            store.fetchLocation(action.locationId);
            break;
        case VegaDNSConstants.ADD_LOCATION:
            store.addLocation(action.locationName, action.locationDescription);
            break;
        case VegaDNSConstants.EDIT_LOCATION:
            store.editLocation(action.locationId, action.locationName, action.locationDescription);
            break;
        case VegaDNSConstants.DELETE_LOCATION:
            store.deleteLocation(action.locationId);
            break;
    }
});

module.exports = store;
