const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    devtool: 'source-map',
    entry: './src/popup.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, '../extension/dist'),
        clean: true,
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "popup.html", to: "" },
                { from: "manifest.json", to: "" },
                { from: "icons", to: "icons" },
                { from: "lib", to: "lib" },
                { from: "styles", to: "styles" },
            ],
        }),
    ],
};