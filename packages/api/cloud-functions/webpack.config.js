const path = require('path');

module.exports = {
  target: 'node',
  mode: 'production',
  entry: {
    main: './cloud-functions/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader', path.join(__dirname, './add-entities.js')],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
  },
  devtool: 'inline-source-map',
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, './dist'),
    libraryTarget: 'commonjs',
  },
  externals: {
    'firebase-admin': 'firebase-admin',
    'firebase-functions': 'firebase-functions',
  },
  optimization: {
    minimize: false,
  },
};
