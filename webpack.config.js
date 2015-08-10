var webpack = require('webpack');

// webpack.config.js
module.exports = {
    entry: {
        app: './public/js/app.js'
    },
    output: {
        filename: 'bundle.js',
        path: './public/js/',
        publicPath: '/js/'
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
