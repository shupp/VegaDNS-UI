var AppDispatcher = require('../dispatcher/AppDispatcher');
var VegaDNSConstants = require('../constants/VegaDNSConstants');

var VegaDNSActions = {
    login: function(email, password) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LOGIN,
            email: email,
            password: password
        });
    },
    logout: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LOGOUT
        });
    },
    updateLogin: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.UPDATE_LOGIN
        });
    },
    listDefaultRecords: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_DEFAULT_RECORDS
        });
    },
    addDefaultRecord: function(payload) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_DEFAULT_RECORD,
            payload: payload
        });
    },
    deleteDefaultRecord: function(recordId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_DEFAULT_RECORD,
            recordId: recordId
        });
    },
    getDefaultRecord: function(recordId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.GET_DEFAULT_RECORD,
            recordId: recordId
        });
    },
    getDefaultSOARecord: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.GET_DEFAULT_SOA_RECORD
        });
    },
    editDefaultRecord: function(default_record) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.EDIT_DEFAULT_RECORD,
            default_record: default_record
        });
    },
    listRecords: function(
        domainId, page, perPage, sort, order, search_name=false, search_value=false
    ) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_RECORDS,
            domainId: domainId,
            page: page,
            perPage: perPage,
            sort: sort,
            order: order,
            search_name: search_name,
            search_value: search_value
        });
    },
    getSOARecord: function(domainId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.GET_SOA_RECORD,
            domainId: domainId
        });
    },
    getRecord: function(recordId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.GET_RECORD,
            recordId: recordId
        });
    },
    addRecord: function(payload) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_RECORD,
            payload: payload
        });
    },
    editRecord: function(record) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.EDIT_RECORD,
            record: record
        });
    },
    deleteRecord: function(recordId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_RECORD,
            recordId: recordId
        });
    },
    listGroupMembers: function(groupmemberId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_GROUP_MEMBERS,
            groupmemberId: groupmemberId
        });
    },
    addGroupMember: function(group, account) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_GROUP_MEMBER,
            group: group,
            account: account
        });
    },
    editGroupMember: function(groupmemberId, isAdmin) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.EDIT_GROUP_MEMBER,
            groupmemberId: groupmemberId,
            isAdmin: isAdmin
        });
    },
    deleteGroupMember: function(group, account, groupmemberId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_GROUP_MEMBER,
            group: group,
            account: account,
            groupmemberId: groupmemberId
        });
    },
    listGroups: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_GROUPS
        });
    },
    addGroup: function(group) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_GROUP,
            group: group
        });
    },
    getGroup: function(groupId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.GET_GROUP,
            groupId: groupId
        });
    },
    editGroup: function(group) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.EDIT_GROUP,
            group: group
        });
    },
    deleteGroup: function(group) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_GROUP,
            group: group
        });
    },
    addNotification: function(messageType, message, autoDismiss) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_NOTIFICATION,
            messageType: messageType,
            message: message,
            autoDismiss: autoDismiss
        });
    },
    dismissNotification: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DISMISS_NOTIFICATION
        });
    },
    errorNotification: function(defaultMessage, data=null, autoDismiss=false) {
        if (data != null) {
            if (typeof data.responseJSON != "undefined" && typeof data.responseJSON.message !== "undefined") {
                defaultMessage += data.responseJSON.message;
            }
        }

        this.addNotification(
            VegaDNSConstants.NOTIFICATION_DANGER,
            defaultMessage,
            autoDismiss
        );
    },
    successNotification: function(message, autoDismiss=true) {
        this.addNotification(
            VegaDNSConstants.NOTIFICATION_SUCCESS,
            message,
            autoDismiss
        );
    },
    redirect: function(route) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.REDIRECT_ROUTE,
            route: route
        });
    }
};

module.exports = VegaDNSActions;
