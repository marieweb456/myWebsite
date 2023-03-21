// const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

// const isProduction = process.env.NODE_ENV === 'production';

// const stylesHandler = MiniCssExtractPlugin.loader;

// const config = {
//   entry: './src/index.js',
//   output: {
//     path: path.resolve(__dirname, 'dist'),
//     filename: 'main.js',
//   },
//   plugins: [
//     new MiniCssExtractPlugin(),
//     new HtmlWebpackPlugin({
//       template: './public/index.html',
//       filename: 'index.html',
//     }),
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/i,
//         loader: 'babel-loader',
//       },
//       {
//         test: /\.css$/i,
//         use: [stylesHandler, 'css-loader'],
//       },
//       {
//         test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
//         type: 'asset',
//       },
//     ],
//   },
//   resolve: {
//     fallback: {
//       fs: false,
//       path: require.resolve('path-browserify'),
//       os: require.resolve('os-browserify/browser'),
//       crypto: require.resolve('crypto-browserify'),
//     },
//   },
// };

// module.exports = () => {
//   if (isProduction) {
//     config.mode = 'production';
//   } else {
//     config.mode = 'development';
//   }
//   return config;
// };

const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      crypto: require.resolve('crypto-browserify'),
    },
  },
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'public'),
    port: 3000,
    open: true,
  },
};
