var VegaDNSConfig = {
    host: 'http://localhost:5000',
    version: '1.0'
}

function ApiClient(config) {
    this.config = config;

    this.getHost = function() {
        return this.config.host.replace(/\/$/, "");
    }

    this.getVersionedHost = function() {
        return this.getHost() + "/" + this.config.version;
    }

    this.get = function(path, params, skipVersion) {
        if (skipVersion) {
            host = this.getHost();
        } else {
            host = this.getVersionedHost();
        }
        url = host + path;

        return $.ajax({
            type: "GET",
            url: url,
            data: params,
            xhrFields: {
                withCredentials: true
            }
        });
    }

    this.post = function(path, params, skipVersion) {
        if (skipVersion) {
            host = this.getHost();
        } else {
            host = this.getVersionedHost();
        }
        url = host + path;

        return $.ajax({
            type: "POST",
            url: url,
            data: params,
            xhrFields: {
                withCredentials: true
            }
        });
    }

    this.put = function(path, params, skipVersion) {
        if (skipVersion) {
            host = this.getHost();
        } else {
            host = this.getVersionedHost();
        }
        url = host + path;

        return $.ajax({
            type: "PUT",
            url: url,
            data: params,
            xhrFields: {
                withCredentials: true
            }
        });
    }

    this.healthcheck = function() {
        return this.get("/healthcheck", {}, true);
    }
    this.login = function(email, password) {
        return this.post(
            "/login",
            {
                email: email,
                password: password,
                suppress_response_codes: true,
            }
        );
    }
    this.domains = function() {
        return this.get("/domains");
    }
}

var client = new ApiClient(VegaDNSConfig);

client.login(
    "user@example.com",
    "test1"
).success(function(data) {
    if (data.response_code != undefined) {
        alert('Unable to ligin:' + data.response_code);
    }
    console.log(data);
});

client.domains(
).success(function(data) {
    console.log(data);
}).error(function(data) {
    console.log(data);
    alert("Unable to load domains");
});
