﻿const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        'assets/dist/style': './docs/_scss/style.scss',

        'assets/dist/index': './index.ts',

    },
    cache: true,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'esbuild-loader',
                        options: {
                            loader: "ts",
                        }
                    }
                ],

                include: [
                    path.resolve(__dirname, "src"),
                    path.resolve(__dirname, "workspaces")
                ]
            },
            {
                enforce: 'pre',
                test: /\.html$/,
                loader: 'raw-loader',
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {

                        loader: 'css-loader',
                        options: {
                            url: false // don't complain about url() in css
                        }

                    }, 'sass-loader'],
                include: path.resolve(__dirname, "")
            },


        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    //devtool: 'source-map',
    mode: "development",
    devServer: {
        static: {
            directory: path.join(__dirname, 'docs'),
        },
        compress: true,
        port: 4000,
    },
    plugins: [

        new MiniCssExtractPlugin({
          // Options similar to the same options in webpackOptions.output
          // both options are optional
          filename: "[name].css",
          chunkFilename: "[id].css",
        }),


    ],

    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'docs/'),
    },
};
