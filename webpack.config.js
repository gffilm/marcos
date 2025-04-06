const path = require('path')
const AwsSamPlugin = require('aws-sam-webpack-plugin')
const { EsbuildPlugin } = require('esbuild-loader')

const awsSamPlugin = new AwsSamPlugin()

const mode = process.env.NODE_ENV || 'production'

// Packages/dependencies to be excluded from the webpack compile.
const externalsDef = [
  'aws-sdk',

  // Possible drivers for knex - we'll ignore them
  'better-sqlite3',
  'sqlite3',
  'mariasql',
  'mssql',
  'mysql',
  'oracle',
  'strong-oracle',
  'tedious',
  'oracledb',
  'pg',
  'pg-query-stream'
]

// Remove 'mysql|awsSdk' from externalsDef if mode is 'development|local'
if (mode.trim() === 'development' || mode.trim() === 'local') {
  const pgIndex = externalsDef.indexOf('pg')
  if (pgIndex !== -1) {
    externalsDef.splice(pgIndex, 1)
  }
  const awsSdkIndex = externalsDef.indexOf('aws-sdk')
  if (awsSdkIndex !== -1) {
    externalsDef.splice(awsSdkIndex, 1)
  }
}

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

  // Set the webpack mode
  // Is Local or Production
  mode,

  // Create source maps
  devtool: false,

  // Resolve .ts and .js extensions
  resolve: {
    extensions: ['.ts', '.js']
  },

  // Target node
  target: 'node',

  // AWS recommends always including the aws-sdk in your Lambda package but excluding can significantly reduce
  // the size of your deployment package. If you want to always include it then comment out this line. It has
  // been included conditionally because the node10.x docker image used by SAM local doesn't include it.
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

  // Add the TypeScript loader
  module: {
    rules: [{
      test: /\.ts?$/,
      loader: 'esbuild-loader',
      options: {
        tsconfig: './api/tsconfig.json'
      }
    }]
  },

  // Add the AWS SAM Webpack plugin
  plugins: [
    awsSamPlugin
  ],

  // Show 100 assets sorted by size.
  // Disable warnings.
  stats: {
    assetsSort: '!size',
    assetsSpace: 100,
    warnings: false
  }
}
