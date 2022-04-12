const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const version = require('./package.json').version;

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;

module.exports = (env, options) => {
  const config = {
    mode: 'production',
    /**
     * entry point란 진입점에 해당함. 
     * 진입점 파일을 기준으로 모든 js, css파일들을 묶어 하나의 js로 만들어주며, 
     * 기준점에 있는 모든 이미지나 파일들을 output 파일로 반환해준다.
     * 이를 번들링이라고 한다.
     * 번들링: 여러개의 파일(.js, .css, .png 등 파일들)을 하나의 파일로 묶어 패키징을 시키는 과정
     *  */
    entry: './src/index.js',
    /**
     * output은 번들링된 코드를 어떤 경로에 어떤 js이름으로 생성할 것인가 설정하는 것이다.
     * filename은 파일이름을 어떻게 내보낼 것인가 인데 보통은 지정한이름.bundle.js를 통상적으로 사용
     * path는 디렉토리에서 어느 경로에 번들링한 파일을을 생성할 것인가 지정하는 것.
     */
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
      path: path.resolve(
        __dirname + '/build'
      )
    },
    /**
     * optimization은 빌드 과정을 커스터마이징하는 옵션이다
     * 최적화 과정을 하는 이유는 코드가 많아지면 번들링된 결과물이 메가바이트 단위로 커지게 되어, 브라우저 성능에 영향을 준다.
       그래서 웹팩으로 번들 결과를 압축하거나 분리하여 최적화를 한다.
     */
    optimization: {
      minimizer: mode === 'production' ? 
      [
        new OptimizeCSSAssetsPlugin(), // OptimizeCSSAssetsPlugin => css 파일 빈칸을 없애서 압축
        /** TerserPlugin은
         * 기본 설정으로 JavaScript 코드를 난독화 하고 debugger 구문을 제거
            console.log를 제거하는 옵션도 있다.
         */
        new TerserPlugin({
          terserOptions: {
            compress: {
              // console.log를 제거하는 옵션
              drop_console: true,
            }
          }
        })
      ] : [],  
      //전체 애플리케이션에서 node_modules의 모든 코드를 포함하는 vendors 청크를 만드는 설정
      splitChunks: {
        cacheGroups: {
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all' // 중복되는 코드를 제거한다
          },
        },
      },
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: '/node_modules',
          use: ['babel-loader'],
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
        template: './index.html',
        filename: 'index.html',
      }),
      new ManifestPlugin({
        fileName: 'assets.json',
      }),
      // new BundleAnalyzerPlugin(),
      new webpack.DefinePlugin({
        DEF_TARGET: JSON.stringify(options.target || 'web'),
        DEF_MODE: JSON.stringify(options.mode),
        APP_VERSION: JSON.stringify(version),
      }),
    ],
    resolve: {
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
