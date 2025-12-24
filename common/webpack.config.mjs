import path from 'path';
import {defineConfig} from "webpack-define-config";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import * as fs from "node:fs";
import {CleanWebpackPlugin} from "clean-webpack-plugin";

function getRootPath() {
    let currentPath = path.resolve("./");

    let maxDepth = currentPath.split(path.sep).length;
    let rootPath = "./";
    for (let i = 0; i < maxDepth; i++) {
        if (fs.existsSync(path.resolve(currentPath, rootPath, ".misc-root"))) {
            return rootPath;
        }
        rootPath += "../";
    }
    throw new Error("Could not find .misc-root in any parent directory of \"" + currentPath + "\".")
}
export function webpackConfigPreset(isRoot=false) {
    let packageJson = JSON.parse(fs.readFileSync(path.resolve(`./package.json`), {encoding: "utf-8"}));
    let projectName = packageJson.name;
    let isFrontend = packageJson.frontend;

    let rootPath = getRootPath();
    let commonPath = rootPath + "common/";
    let distPath;
    if (!isFrontend) {
        distPath = "./dist/";
    } else {
        distPath = rootPath + "dist/" + (isRoot ? "" : projectName + "/");
    }
    return defineConfig({
        mode: "production",
        target: isFrontend ? "web" : "node",

        entry: "./src/index",

        output: {
            path: path.resolve(distPath),
            filename: `[name]-[contenthash].js`,
            assetModuleFilename: '[hash][ext][query]',
            publicPath: './',
        },

        module: {
            rules: [
                {
                    test: /\.(js|jsx|tsx|ts)$/,
                    exclude: /node_modules/,
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-typescript',
                            ['@babel/preset-react', {"runtime": "automatic"}]
                        ]
                    }
                },
                {
                    test: /\.svg$/i,
                    use: ['svg-sprite-loader',
                        'svgo-loader']
                },
                {
                    test: /\.css$/i,
                    use: ["style-loader", "css-loader"],
                },
                {
                    test: /\.png$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.(woff|woff2|eot|ttf|otf)$/i,
                    type: 'asset/resource',
                },
                {
                    test: /\.(glsl|vsh|fsh)$/i,
                    //use: ['raw-loader', 'webpack-lygia-loader']
                    loader: '@mrgazdag/ts-shader-loader'
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        // Creates `style` nodes from JS strings
                        "style-loader",
                        // Translates CSS into CommonJS
                        "css-loader",
                        // Compiles Sass to CSS
                        "sass-loader",
                    ],
                }
            ]
        },

        resolve: {
            extensions: [
                '.tsx',
                '.ts',
                '.js'
            ]
        },

        plugins: (()=>{
            /** @type any[] */
            let plugins = [
                new CleanWebpackPlugin()
            ];
            if (!isFrontend) return plugins;

            plugins.push(new HtmlWebpackPlugin({
                template: commonPath + "index.html",
                publicPath: `./`,
                templateParameters: {
                    title: isRoot ? "Fun Projects" : packageJson.displayName,
                },
                filename: "./index.html",
                //favicon: "../../common/favicon.ico"
            }))
            if (isRoot) return plugins;

            plugins.push(new CopyWebpackPlugin({
                patterns: [
                    {
                        from: "./thumbnail.png",
                        to: "./thumbnail.png"
                    }
                ]
            }));
            return plugins;
        })()
    });
}