const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const BASE_JS = "./src/client/js/";
// const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: {
    main: BASE_JS + "main.js",
    videoPlayer: BASE_JS + "videoPlayer.js",
    videoUpload: BASE_JS + "videoUpload.js",
    modal: BASE_JS + "modal.js",
    commentSection: BASE_JS + "commentSection.js",
  },
  mode: "development",
  watch: true,
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/styles.css",
    }),
  ],
  output: {
    filename: "js/[name].js",
    path: path.resolve(__dirname, "assets"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env", { targets: "defaults" }]],
          },
        },
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"],
      },
    ],
  },
  target: "web",
};
