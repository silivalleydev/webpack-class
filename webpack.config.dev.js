const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const version = require('./package.json').version;

module.exports = (env, options) => {
  // options.target == 'web'
  const config = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(
        __dirname + "/build"
      ),
      publicPath: '/',
      pathinfo: false, // 포함된 모듈에 대한 정보를 주석으로 번들에 포함하도록 webpack에 지시 <-- default는 prod는 false, dev는 true
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: '/node_modules',
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['react-hot-loader/babel'],
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: { minimize: false },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        }
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebPackPlugin({
        template: './index.dev.html',
        filename: 'index.html',
        showErrors: true, // 에러 발생시 메세지가 브라우저 화면에 노출 된다.
      }),
      new ManifestPlugin({
        fileName: 'assets.json',
        basePath: '/',
      }),
      new HardSourceWebpackPlugin(),
      // new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
        DEF_TARGET: JSON.stringify(options.target || 'web'),
        DEF_MODE: JSON.stringify(options.mode),
        APP_VERSION: JSON.stringify(version),
      }),
    ],
    devServer: {
      contentBase: path.join(
        __dirname,
        './build/'
      ),
      port: 3000,
      historyApiFallback: true,
      stats: {
        color: true,
      },
    },
    resolve: {
      // fallback: { "fs": false },      
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@C': path.resolve(__dirname, 'src/components/'),
        '@COMMON': path.resolve(__dirname, 'src/components/common'),
        '@STYLE': path.resolve(__dirname, 'src/css'),
      },
    },
  };
  return config;
};
