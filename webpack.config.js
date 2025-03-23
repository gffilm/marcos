const path = require('path')
const AwsSamPlugin = require('aws-sam-webpack-plugin')
const { EsbuildPlugin } = require('esbuild-loader')

const awsSamPlugin = new AwsSamPlugin()

const mode = process.env.NODE_ENV || 'production'

// Packages/dependencies to be excluded from the webpack compile.
const externalsDef = [
  'aws-sdk',
  'oracle',
  'strong-oracle',
  'tedious',
  'oracledb',
  'pg',
  'pg-query-stream'
]

module.exports = {
  // Loads the entry object from the AWS::Serverless::Function resources in your
  // SAM config. Setting this to a function will
  entry: () => awsSamPlugin.entry(),

  // Write the output to the .aws-sam/build folder
  output: {
    filename: (chunkData) => awsSamPlugin.filename(chunkData),
    libraryTarget: 'commonjs2',
    path: path.resolve('.')
  },
  mode,
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js']
  },
  target: 'node',
  externals: externalsDef,

  optimization: {
    usedExports: true,
    sideEffects: true,

    minimizer: [
      new EsbuildPlugin({
        format: 'cjs',
        minify: true,
        minifyIdentifiers: true,
        minifySyntax: true
      })
    ]
  },
  module: {
    rules: [{
      test: /\.ts?$/,
      loader: 'esbuild-loader',
      options: {
        tsconfig: './api/tsconfig.json'
      }
    }]
  },
  plugins: [
    awsSamPlugin
  ],
  stats: {
    assetsSort: '!size',
    assetsSpace: 100,
    warnings: false
  }
}
