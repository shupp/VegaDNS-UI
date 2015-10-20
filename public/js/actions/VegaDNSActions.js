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
    listDomains: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_DOMAINS
        });
    },
    addDomain: function(domain) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_DOMAIN,
            domain: domain
        });
    },
    deleteDomain: function(domain) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_DOMAIN,
            domain: domain
        });
    },
    listRecords: function(domainId, page, perPage, sort, order) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_RECORDS,
            domainId: domainId,
            page: page,
            perPage: perPage,
            sort: sort,
            order: order
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
    listDomainGroupMaps: function(groupId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_DOMAIN_GROUP_MAPS,
            groupId: groupId
        });
    },
    addDomainGroupMap: function(group, domain, permissions) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_DOMAIN_GROUP_MAP,
            group: group,
            domain: domain,
            permissions: permissions
        });
    },
    editDomainGroupMap: function(domaingroupmapId, permissions) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.EDIT_DOMAIN_GROUP_MAP,
            domaingroupmapId: domaingroupmapId,
            permissions: permissions
        });
    },
    deleteDomainGroupMap: function(domaingroupmap) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_DOMAIN_GROUP_MAP,
            domaingroupmap: domaingroupmap
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
    listApiKeys: function(accountIds) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_APIKEYS,
            accountIds: accountIds
        });
    },
    addApiKey: function(accountId, description) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_APIKEY,
            accountId: accountId,
            description: description
        });
    },
    deleteApiKey: function(apiKeyId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_APIKEY,
            apiKeyId: apiKeyId
        });
    },
    listAccounts: function() {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.LIST_ACCOUNTS
        });
    },
    addAccount: function(account) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.ADD_ACCOUNT,
            account: account
        });
    },
    getAccount: function(accountId) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.GET_ACCOUNT,
            accountId: accountId
        });
    },
    editAccount: function(account) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.EDIT_ACCOUNT,
            account: account
        });
    },
    deleteAccount: function(account) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.DELETE_ACCOUNT,
            account: account
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
    redirect: function(route) {
        AppDispatcher.dispatch({
            actionType: VegaDNSConstants.REDIRECT_ROUTE,
            route: route
        });
    }
};

module.exports = VegaDNSActions;
