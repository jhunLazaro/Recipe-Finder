const path = require('path'); //<node package
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = { // in webpack there are 4 core concepts: the entry point, the output, loaders, and plugins.
    entry: ['babel-polyfill', './src/js/index.js'], //. means the current folder .. for the parent folder
    //output property which tell webpack where to save bundle file
    output: {
        path: path.resolve(__dirname, 'dist'), //need absolute path we need to use built in node package _dirname is the current absolut path
        filename: 'js/bundle.js'
    },
    devServer: {
        contentBase: './dist'
    },
    plugins: [// plugins receives an array
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/index.html' // template is starting html file
        })
    ],
    module: {
        rules: [
            {
                test: /\.js$/, //test will look for all the files and test if they end in .js
                exclude: /node_module/,
                use : { //all javascript file will use babel loader . babel is the one convert this ES6 back to ES5
                    loader: 'babel-loader'
                }
            }
        ]
    }

};