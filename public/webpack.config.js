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
                test: /\.js$/,
                loader: 'babel',
                exclude: /(node_modules)/
            }
        ]
    },
    devtool: "inline-source-map",
    debug: true
};
