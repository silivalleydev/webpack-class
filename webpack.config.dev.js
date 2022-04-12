const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const version = require('./package.json').version;

module.exports = (env, options) => {
  // options.target == 'web'
  const config = {
    entry: './src/index.js',
    devtool: 'inline-source-map',
    output: {
      filename: '[name].[hash].js',
      path: path.resolve(
        __dirname + "/dev-build"
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
      /**
       * 핫 모듈 리플레이스 먼트 개념
       * 웹팩 개발서버는 코드의 변화를 감지해서 전체 화면을 갱신하는데,
       * SPA(싱글페이지 어플리케이션)는 브라우저에서 데이터를 들고 있기 때문에 
       * 리프레시 이후에 입력한 모든 데이터가 초기화되는 불편한 상황이 생긴다.
       * 
       * 이러한 불편함을 해소하고자 생긴 기능이 바로 핫 모듈 리플레이스먼트이다.
       * 핫 모듈 리플레이스먼트는 전체화면을 갱신하지 않고 코드가 변경된 모듈만 갱신 시켜주는 기능이다.
       * 설정은 아래와 같이 devServer에 추가해주면된다.
       * {
       *    hot: true 
       * }
       */
      hot: true,
      // 서버가 로딩할 static 파일 경로 지정 
      contentBase: path.join(
        __dirname,
        './dev-build/'
      ),
      port: 3000,
      /**
       * historyApiFallback은 HTML5의 History API를 사용하는 경우에, 
       * 설정해놓은 url 이외의 url 경로로 접근했을때 404 responses를 받게 되는데 이때도 index.html을 서빙할지 결정하는 옵션이다.
       * 
       * "http://localhost:3000" 에 대해서만 server와 연결했다고 가정했을때
       * 만약 리액트 라우팅으로 디테일 페이지로 들어갔고 그 라우팅을 detailpage라고 가정한다면
       * 링크는 "http://localhost:3000/detailpage"가된다.
       * 
       * 하지만 http://localhost:3000/detailpage는 서버에 연결되지 않았기 때문에 새로고침을 하게되면
       * 서버는 http://localhost:3000에 대해서만 연결했으니
       * http://localhost:3000/detailpage로 연결요청을 하면 서버가 알아먹지 못하고 404 에러 페이지가 떠야한다
       * 
          React와 react-router-dom을 사용해 프로젝트를 만들때 react-router-dom이 내부적으로 HTML5 History API를 사용하므로 
          미지정 경로로 이동했을때 혹은 그 상태에서 refresh를 했을때(새로고침)와 같은 경우에도 
          애플리케이션이 적절히 렌더링을 할 수 있다. react 내부적으로 세션 기록을 저장 여부를 설정해주는 옵션이다. 

          이로 인해 http://localhost:3080가 붙은 주소인 http://localhost:3000/detailpage도 마치 주소가 있는 것처럼
          행동할 수 있게 해주는 옵션이다
       */
      historyApiFallback: true
    },
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
