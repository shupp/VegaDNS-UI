var VegaDNSConfig = require('../utils/VegaDNSConfig');
var URI = require('URIjs');

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
        data["supress_auth_response_codes"] = "true";
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

VegaDNSClient.prototype.records = function(domain_id, filter) {
    var url = this.getHost() + "/records?domain_id=" + domain_id;

    return this.send(url, "GET");
}

VegaDNSClient.prototype.healthcheck = function() {
    var url = this.getHost(false) + "/healthcheck";
    return this.send(url, "GET");
}

module.exports = new VegaDNSClient();
