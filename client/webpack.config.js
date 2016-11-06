var path = require('path')
var webpack = require('webpack')

const credentials = require('./credentials.json');
module.exports = {
    devtool: 'cheap-module-eval-source-map',
    entry: [
        'webpack-hot-middleware/client',
        './src/index'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            "process.env": {
                FIREBASE_API_KEY: JSON.stringify(credentials.FIREBASE_API_KEY),
                FIREBASE_AUTH_DOMAIN: JSON.stringify(credentials.FIREBASE_AUTH_DOMAIN),
                FIREBASE_DB: JSON.stringify(credentials.FIREBASE_DB),
                BITLY_CRED: JSON.stringify(credentials.BITLY_CRED),

                SAVE_STATE: false,
                VERSION: JSON.stringify(require("./package.json").version),
                NODE_ENV: JSON.stringify("development")
            }
        }),
    ],
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    module: {
        noParse: [/node_modules\/json-schema\/lib\/validate\.js/, /node_modules\\json-schema\\lib\\validate\.js/],
        loaders: [
            {test: /\.json$/, loader: 'json'},
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/,
                include: __dirname
            },
            {
                test: /\.css$/,
                loader: 'style!css?sourceMap'
            }, {
                test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/font-woff"
            }, {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=application/octet-stream"
            }, {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: "file"
            }, {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: "url?limit=10000&mimetype=image/svg+xml"
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    }
};
