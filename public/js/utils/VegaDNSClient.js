var VegaDNSConfig = require('../utils/VegaDNSConfig');
var Q = require('q');

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
        password: password,
    };

    return this.send(url, "POST", data);
}

VegaDNSClient.prototype.healthcheck = function() {
    var url = this.getHost(false) + "/healthcheck";
    return this.send(url, "GET");
}

module.exports = new VegaDNSClient();
