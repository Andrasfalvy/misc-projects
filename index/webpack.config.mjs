import {webpackConfigPreset} from "../common/webpack.config.mjs";
import CopyWebpackPlugin from "copy-webpack-plugin";

let config = webpackConfigPreset(true);
config.plugins.push(new CopyWebpackPlugin({
    patterns: [
        {
            from: "./static/",
            to: "./"
        }
    ]
}));
export default config;