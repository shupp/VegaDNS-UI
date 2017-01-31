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

VegaDNSClient.prototype.domains = function(page, perpage, sort, order, search = false) {
    var data = {
        include_permissions: 1
    };

    if (page !== false) {
        data.page = page;
    }
    if (perpage !== false) {
        data.perpage = perpage;
    }
    if (sort !== false) {
        data.sort = sort;
    }
    if (order !== false) {
        data.order = order;
    }
    if (search !== false) {
        data.search = search;
    }

    var url = this.getHost() + "/domains";

    return this.send(url, "GET", data);
}

VegaDNSClient.prototype.updateDomainStatus = function(domain_id, status) {
    var url = this.getHost() + "/domains/" + domain_id;
    var data = {
        status: status
    }

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.updateDomainOwner = function(domain_id, owner_id) {
    var url = this.getHost() + "/domains/" + domain_id;
    var data = {
        owner_id: owner_id
    }

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.defaultRecords = function() {
    var url = this.getHost() + "/default_records";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addDefaultRecord = function(payload) {
    var url = this.getHost() + "/default_records";

    return this.send(url, "POST", payload);
}

VegaDNSClient.prototype.deleteDefaultRecord = function(recordId) {
    var url = this.getHost() + "/default_records/" + recordId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.getDefaultSOARecord = function() {
    var url = this.getHost() + "/default_records?filter_record_type=soa";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.getDefaultRecord = function(recordId) {
    var url = this.getHost() + "/default_records/" + recordId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.editDefaultRecord = function(data) {
    var url = this.getHost() + "/default_records/" + data.record_id;

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.getSOARecord = function(domainId) {
    var url = this.getHost() + "/records?domain_id=" + domainId + "&filter_record_type=soa";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.getRecord = function(recordId) {
    var url = this.getHost() + "/records/" + recordId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.records = function(
    domain_id, page, perpage, sort, order, search_name=false, search_value=false
) {
    var url = this.getHost() + "/records"
    var data = {
        domain_id: domain_id,
        page: page,
        perpage: perpage,
        sort: sort,
        order: order,
        include_permissions: 1
    }

    if (search_name !== false) {
        data.search_name = search_name;
    }

    if (search_value !== false) {
        data.search_value = search_value;
    }

    return this.send(url, "GET", data);
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

VegaDNSClient.prototype.accounts = function(search = false) {
    var data = {}
    if (search !== false) {
        data.search = search;
    }
    var url = this.getHost() + "/accounts";

    return this.send(url, "GET", data);
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

VegaDNSClient.prototype.getDomain = function(domainId) {
    var url = this.getHost() + "/domains/" + domainId;

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

VegaDNSClient.prototype.locations = function() {
    var url = this.getHost() + "/locations";

    return this.send(url, "GET");
}

VegaDNSClient.prototype.getLocation = function(locationId) {
    var url = this.getHost() + "/locations/" + locationId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addLocation = function(locationName, locationDescription) {
    var url = this.getHost() + "/locations";
    var data = {
        location: locationName,
        location_description: locationDescription
    }

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.editLocation = function(locationId, locationName, locationDescription) {
    var url = this.getHost() + "/locations/" + locationId;
    var data = {
        location: locationName,
        location_description: locationDescription
    }

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.deleteLocation = function(locationId) {
    var url = this.getHost() + "/locations/" + locationId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.locationPrefixes = function(locationId) {
    var url = this.getHost() + "/location_prefixes";
    var data = {location_id: locationId}

    return this.send(url, "GET", data);
}

VegaDNSClient.prototype.getLocationPrefix = function(prefixId) {
    var url = this.getHost() + "/location_prefixes/" + prefixId;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.addLocationPrefix = function(locationId, prefix, prefixDescription, prefixType) {
    var url = this.getHost() + "/location_prefixes";
    var data = {
        location_id: locationId,
        prefix: prefix,
        prefix_description: prefixDescription,
        prefix_type: prefixType
    }

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.editLocationPrefix = function(prefixId, prefix, prefixDescription, prefixType) {
    var url = this.getHost() + "/location_prefixes/" + prefixId;
    var data = {
        prefix: prefix,
        prefix_description: prefixDescription,
        prefix_type: prefixType
    }

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.deleteLocationPrefix = function(prefixId) {
    var url = this.getHost() + "/location_prefixes/" + prefixId;

    return this.send(url, "DELETE");
}

VegaDNSClient.prototype.audit_logs = function(page, perpage, sort, order, search = false, domainIds = false) {
    var data = {
        page: page,
        perpage: perpage,
        sort: sort,
        order: order
    };
    if (domainIds !== false) {
        data.domain_ids = domainIds;
    }
    if (search !== false) {
        data.search = search;
    }

    var url = this.getHost() + "/audit_logs";

    return this.send(url, "GET", data);
}

VegaDNSClient.prototype.passwordResetRequest = function(email) {
    var url = this.getHost() + "/password_reset_tokens";
    var data = {
        email: email
    };

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.passwordReset = function(password, token) {
    var url = this.getHost() + "/password_reset_tokens/" + token;
    var data = {
        password: password
    };

    return this.send(url, "PUT", data);
}

VegaDNSClient.prototype.passwordResetTokenCheck = function(token) {
    var url = this.getHost() + "/password_reset_tokens/" + token;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.healthcheck = function() {
    var url = this.getHost(false) + "/healthcheck";
    return this.send(url, "GET");
}

VegaDNSClient.prototype.releaseVersion = function() {
    var url = this.getHost() + "/release_version";
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
