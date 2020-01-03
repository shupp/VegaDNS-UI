var webpack = require('webpack');
var plugins = [];
var devtool = "inline-source-map";

if (process.env.hasOwnProperty('ENV') && process.env.ENV === 'production') {
    devtool = "source-map";

    plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })
    );

    plugins.push(
        new webpack.LoaderOptionsPlugin({
            debug: true
        })
    );
}

// webpack.config.js
module.exports = {
    entry: {
        app: './public/js/app.js'
    },
    output: {
        filename: 'bundle.js',
        path: __dirname + '/public/js/',
        publicPath: '/js/'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['env', 'react']
                }
            },
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
        ]
    },
    plugins: plugins,
    devtool: devtool,
    node: {
        fs: "empty"
    }
};
