var VegaDNSConfig = require('../utils/VegaDNSConfig');
var URI = require('urijs');

var VegaDNSClient = function() {
    var loggedIn = false;
}

VegaDNSClient.prototype.getHost = function(version=true) {
    var host = VegaDNSConfig.host.replace("/$", "");
    if (version) {
        host = host + "/" + VegaDNSConfig.version;
    }
    return host;
}

VegaDNSClient.prototype.send = function(url, method, data) {
    if (typeof data === "undefined") {
        data = {};
    }
    if (method == "GET") {
        var url = new URI(url).addQuery(
            "suppress_auth_response_codes", "true"
        ).toString();
    } else {
        data["suppress_auth_response_codes"] = "true";
    }

    return $.ajax({
        type: method,
        url: url,
        data: data,
        xhrFields: {
            withCredentials: true
        },
        dataType: "json"
    });
}

VegaDNSClient.prototype.login = function(email, password) {
    var url = this.getHost() + "/login";
    var data = {
        email: email,
        password: password
    };

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.checkLogin = function() {
    var url = this.getHost() + "/login";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.logout = function() {
    var url = this.getHost() + "/logout";

    return this.send(url, "POST");
}

VegaDNSClient.prototype.domains = function(filter) {
    var url = this.getHost() + "/domains";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.defaultRecords = function() {
    var url = this.getHost() + "/default_records";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addDefaultRecord = function(payload) {
    var url = this.getHost() + "/default_records";

    return this.send(url, "POST", payload);
}

VegaDNSClient.prototype.getRecord = function(recordId) {
    var url = this.getHost() + "/records/" + recordId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.records = function(domain_id, page, perpage, sort, order) {
    var url = this.getHost() + "/records?domain_id=" + domain_id;
    url = url + "&page=" + page + "&perpage=" + perpage + "&sort=" + sort + "&order=" + order;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addRecord = function(payload) {
    var url = this.getHost() + "/records";

    return this.send(url, "POST", payload);
}

VegaDNSClient.prototype.editRecord = function(data) {
    var url = this.getHost() + "/records/" + data.record_id;

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.deleteRecord = function(recordId) {
    var url = this.getHost() + "/records/" + recordId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.apikeys = function(accountIds) {
    var url = this.getHost() + "/apikeys";
    var data = {
        account_ids: accountIds
    }

    return this.send(url, "GET", data);
}

VegaDNSClient.prototype.addApiKey = function(account_id, description) {
    var url = this.getHost() + "/apikeys";
    var data = {
        account_id: account_id,
        description: description
    }

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.deleteApiKey = function(apiKeyId) {
    var url = this.getHost() + "/apikeys/" + apiKeyId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.getAccount = function(accountId) {
    var url = this.getHost() + "/accounts/" + accountId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.accounts = function() {
    var url = this.getHost() + "/accounts";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.searchAccounts = function(search) {
    var url = this.getHost() + "/accounts?search=" + search;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.searchDomains = function(search) {
    var url = this.getHost() + "/domains?search=" + search;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addAccount = function(data) {
    var url = this.getHost() + "/accounts";

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.editAccount = function(data) {
    var url = this.getHost() + "/accounts/" + data.account_id;

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.deleteAccount = function(accountId) {
    var url = this.getHost() + "/accounts/" + accountId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.domaingroupmaps = function(groupId) {
    var url = this.getHost() + "/domaingroupmaps?group_id=" + groupId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addDomainGroupMap = function(groupId, domainId, permissions) {
    var url = this.getHost() + "/domaingroupmaps";
    var data = {
        group_id: groupId,
        domain_id: domainId,
        can_read: permissions.can_read,
        can_write: permissions.can_write,
        can_delete: permissions.can_delete
    };

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.editDomainGroupMap = function(domaingroupmapId, permissions) {
    var url = this.getHost() + "/domaingroupmaps/" + domaingroupmapId;
    var data = {
        can_read: permissions.can_read,
        can_write: permissions.can_write,
        can_delete: permissions.can_delete
    };

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.deleteDomainGroupMap = function(domaingroupmapId) {
    var url = this.getHost() + "/domaingroupmaps/" + domaingroupmapId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.groupmembers = function(groupId) {
    var url = this.getHost() + "/groupmembers?group_id=" + groupId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addGroupMember = function(groupId, accountId) {
    var url = this.getHost() + "/groupmembers";
    var data = {
        group_id: groupId,
        account_id: accountId,
        is_admin: 0 // Defaults to non-admin
    };

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.editGroupMember = function(groupmemberId, isAdmin) {
    var url = this.getHost() + "/groupmembers/" + groupmemberId;
    var data = { is_admin: isAdmin };

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.deleteGroupMember = function(groupmemberId) {
    var url = this.getHost() + "/groupmembers/" + groupmemberId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.groups = function() {
    var url = this.getHost() + "/groups";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addGroup = function(data) {
    var url = this.getHost() + "/groups";

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.editGroup = function(data) {
    var url = this.getHost() + "/groups/" + data.group_id;

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.deleteGroup = function(groupId) {
    var url = this.getHost() + "/groups/" + groupId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.getGroup = function(groupId) {
    var url = this.getHost() + "/groups/" + groupId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addDomain = function(domain) {
    var url = this.getHost() + "/domains" ;
    var data = {
        domain: domain
    }

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.deleteDomain = function(domainId) {
    var url = this.getHost() + "/domains/" + domainId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.healthcheck = function() {
    var url = this.getHost(false) + "/healthcheck";
    return this.send(url, "GET");
}

VegaDNSClient.prototype.containsAuthError = function(data) {
    if ("status" in data) {
        if (data.status == "error") {
            return true;
        }
    }
    return false;
}

module.exports = new VegaDNSClient();
