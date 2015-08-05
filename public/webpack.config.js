var webpack = require('webpack');

// webpack.config.js
module.exports = {
    entry: {
        app: './js/app.js'
    },
    output: {
        filename: './js/bundle.js'
    },
    module: {
        loaders: [
            {
                loader: 'babel'
            }
        ]
    },
    devtool: "inline-source-map",
    debug: true
};
