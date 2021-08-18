const path = require("path");
const webpack = require("webpack"); //to access built-in plugins
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const packagejson = require("./package.json");
const libraryName = packagejson.name.replace(/[-\/]/g, "_").replace(/@/g, "");

module.exports = (env, argv) => {
    const overrides = module.exports || {};

    // Mode
    let mode;
    if (argv && argv.mode) {
        mode = argv.mode;
    } else if (overrides.mode) {
        mode = overrides.mode;
    } else {
        mode = "production";
    }

    // Entry
    const entry = {
        main: argv && argv.entry ? argv.entry : "./dist/index.js",
    };

    // Output
    const filenameJs = `${libraryName}.${mode === "development" ? "dev" : "min"}.js`;
    const filenameCss = `${libraryName}.css`;

    // Devtool
    const devtool = argv.devtool || (mode === "development" ? "eval-source-map" : false);

    // NOTE: Keep order of the following configuration output
    // See: https://webpack.js.org/configuration/
    return {
        mode: mode,
        entry,
        output: {
            path: path.resolve(__dirname, "build"),
            filename: filenameJs,
            library: {
                type: "window",
                name: libraryName,
            },
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: "babel-loader",
                },
                {
                    test: /\.tsx?$/,
                    exclude: /node_modules/,
                    use: ["babel-loader", "ts-loader"],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: mode === "production" ? MiniCssExtractPlugin.loader : "style-loader",
                        },
                        "css-loader",
                    ],
                },
                {
                    test: /\.(png|jpg|jpeg|gif)$/i,
                    use: {
                        loader: "url-loader",
                    },
                },
                {
                    test: /\.svg$/,
                    use: {
                        loader: "@svgr/webpack",
                        options: {
                            svgo: false,
                        },
                    },
                },
            ],
        },
        resolve: {
            extensions: [".ts", ".tsx", ".js", ".jsx"],
            fallback: {
                child_process: false,
                fs: false,
            },
        },
        devtool: devtool,
        plugins: [
            new webpack.ProvidePlugin({
                process: "process/browser",
            }),
            new MiniCssExtractPlugin({
                filename: filenameCss,
            }),
            new HtmlWebpackPlugin({
                filename: path.resolve(__dirname, "build", "index.html"),
                template: path.resolve(__dirname, "public", "index.html"),
                inject: true,
                favicon: path.resolve(__dirname, "public", "favicon.ico"),
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "public",
                        globOptions: {
                            ignore: ["**.html"],
                        },
                    },
                ],
            }),
            new webpack.IgnorePlugin(/(fs|child_process)/),
        ],
        optimization: {
            minimizer: [
                () => {
                    return () => {
                        return {
                            terserOptions: {},
                        };
                    };
                },
                new CssMinimizerPlugin({}),
            ],
        },
    };
};
