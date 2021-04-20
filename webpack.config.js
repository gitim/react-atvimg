const production = process.env.NODE_ENV === 'production'
const TerserPlugin = require('terser-webpack-plugin')
const path = require('path')
const loaderUtils = require('loader-utils')
const postcssNormalize = require('postcss-normalize')

const packageDirectory = process.cwd()
const srcDirectory = path.resolve(packageDirectory, 'src')
const outDirectory = path.resolve(packageDirectory, 'dist')

function getCSSModuleLocalIdent(context, localIdentName, localName, options) {
  // Use the filename or folder name, based on some uses the index.js / index.module.(css|scss|sass) project style
  const fileNameOrFolder = context.resourcePath.match(/index\.module\.(css|scss|sass)$/)
    ? '[folder]'
    : '[name]'
  // Create a hash based on a the file location and class name. Will be unique across a project, and close to globally unique.
  const hash = loaderUtils.getHashDigest(
    path.posix.relative(context.rootContext, context.resourcePath) + localName,
    'md5',
    'base64',
    5,
  )
  // Use loaderUtils to find the file or folder name
  const className = loaderUtils.interpolateName(
    context,
    fileNameOrFolder + '_' + localName + '__' + hash,
    options,
  )
  // Remove the .module that appears in every classname when based on the file and replace all "." with "_".
  return className.replace('.module_', '_').replace(/\./g, '_')
}

module.exports = {
  entry: path.resolve(srcDirectory, 'index.ts'),
  output: {
    filename: 'index.js',
    path: outDirectory,
    libraryTarget: 'umd',
    library: 'react-atvimg',
  },
  externals: {
    react: 'react',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
      {
        test: /\.css?$/,
        loader: [
          require.resolve('style-loader'),
          {
            loader: require.resolve('css-loader'),
            options: {
              importLoaders: 3,
              sourceMap: production,
              modules: {
                getLocalIdent: getCSSModuleLocalIdent,
              },
            },
          },
          {
            // Options for PostCSS as we reference these options twice
            // Adds vendor prefixing based on your specified browser support in
            // package.json
            loader: require.resolve('postcss-loader'),
            options: {
              postcssOptions: {
                // Necessary for external CSS imports to work
                // https://github.com/facebook/create-react-app/issues/2677
                ident: 'postcss',
                plugins: [
                  require('postcss-flexbugs-fixes'),
                  require('postcss-preset-env')({
                    autoprefixer: {
                      flexbox: 'no-2009',
                    },
                    stage: 3,
                  }),
                  // Adds PostCSS Normalize as the reset css with default options,
                  // so that it honors browserslist config in package.json
                  // which in turn let's users customize the target behavior as per their needs.
                  postcssNormalize(),
                ],
              },
              sourceMap: production,
            },
          },
          {
            loader: require.resolve('resolve-url-loader'),
            options: {
              sourceMap: production,
            },
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.css'],
    modules: ['node_modules', srcDirectory],
  },
  devtool: false,
  mode: production ? 'production' : 'development',
  optimization: {
    minimizer: [new TerserPlugin()],
  },
}
