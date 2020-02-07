
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

const devWebpackConfig = merge(baseWebpackConfig, {
    mode: 'development',
    output: {
        path: path.resolve(__dirname, '../dist/'), // to store all output files (absolute) at /dist/
        publicPath: 'public/assets/', //  where your upload bundle files
        filename: '[name].[chunkhash].js'
    },
    plugins: [
        // new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: '../src/_includes/scripts.html',
            template: './_includes/_scripts.html'
        }),
        new HtmlWebpackPlugin({
            filename: '../src/scripts.html',
            // template: './_includes/_scripts.html'
        }),
        new VueLoaderPlugin()
    ],
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    chunks: 'initial',
                    test: path.resolve(__dirname, '../node_modules'),
                    name: 'vendor',
                    enforce: true
                }
            }
        }
    },
});

module.exports = devWebpackConfig;
