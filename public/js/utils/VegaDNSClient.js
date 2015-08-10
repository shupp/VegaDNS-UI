var VegaDNSConfig = require('../utils/VegaDNSConfig');

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

VegaDNSClient.prototype.login = function(email, password) {
    return $.ajax({
        type: 'POST',
        url: this.getHost() + "/login",
        data: {
            email: email,
            password: password,
        },
        xhrFields: {
            withCredentials: true
        },
        dataType: 'json'
    });
}

VegaDNSClient.prototype.healthcheck = function() {
    return $.ajax({
        type: 'GET',
        url: this.getHost(false) + "/healthcheck",
        dataType: 'json',
        xhrFields: {
            withCredentials: true
        }
    });
}

module.exports = VegaDNSClient;
