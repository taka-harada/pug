const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

const getAllTemplateFiles = (dirName, ext) => {
  return new Promise((resolve, reject) => {
    let arr = [];

    fs.readdir('./' + dirName, (err, files) => {
      files.forEach((file) => {
        if (file.indexOf(ext) === -1) return;
        const tmp = {
          filename: file.replace(ext, '.html'),
          template: './' + dirName + '/' + file
        };

        arr.push(new HtmlWebpackPlugin(tmp));
      });
    
      resolve(arr);
    });
  });
};

const createConfig = async () => {
  const arr = await getAllTemplateFiles('template', '.pug');
  
  const obj = {
    entry: {
      app: './app'
    },  
    output: {
      path: __dirname + '/dist',
      filename: 'app.min.js'
    },
    module: {
      rules: [{
        test: /\.pug$/,
        loader: [
          {
            loader: 'raw-loader'
          },
          {
            loader: 'pug-html-loader'
          }
        ]
      }]
    },
    plugins: [
      new webpack.optimize.UglifyJsPlugin()
    ].concat(arr),
    resolve: {
      extensions: ['.js']
    }
  };
  
  return obj;
};

module.exports = createConfig;
