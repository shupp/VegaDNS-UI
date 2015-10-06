"use strict";

var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');
var VegaDNSActions = require('../actions/VegaDNSActions');

function redirect(route) {
    window.location.hash = "#" + route;
}

AppDispatcher.register(function(action) {
    switch(action.actionType) {
        case VegaDNSConstants.REDIRECT_ROUTE:
            redirect(action.route);
            break;
    }
});

module.exports = redirect;
