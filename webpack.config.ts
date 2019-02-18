import path from 'path'
import { Configuration } from 'webpack'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import nodeExternals from 'webpack-node-externals'

const common: Configuration = {
  context: path.resolve(__dirname),
  devtool: process.env.MODE !== 'production' ? 'source-map' : undefined,
  mode: process.env.MODE !== 'production' ? 'development' : 'production',
  resolve: {
    alias: {
      '@client': path.resolve('./src/client'),
      '@common': path.resolve('./src/common'),
      '@components': path.resolve('./src/common/components'),
      '@libs': path.resolve('./src/libraries'),
      '@server': path.resolve('./src/server')
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
}

const client: Configuration = {
  ...common,
  entry: {
    client: path.resolve('./src/client/index.tsx')
  },
  module: {
    rules: [
      {
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'postcss-loader'
        ],
        test: /\.css?$/
      },
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            'babel-plugin-macros'
          ],
          presets: [
            '@babel/preset-typescript',
            '@babel/preset-react',
            [
              '@babel/preset-env',
              {
                targets: '> 0.2%, not dead'
              }
            ]
          ]
        },
        test: /\.tsx?$/
      }
    ]
  },
  name: 'client',
  output: {
    // filename: '[name]-[chunkhash].js',
    filename: '[name].js',
    path: path.resolve('./dist/client/public'),
    publicPath: '/'
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new CleanWebpackPlugin([path.resolve('./dist/client')]),
    new CopyWebpackPlugin([path.resolve('./src/common/static')])
  ]
}

const server: Configuration = {
  ...common,
  entry: {
    server: path.resolve('./src/server/index.tsx')
  },
  externals: [
    nodeExternals()
  ],
  output: {
    filename: '[name].js',
    path: path.resolve('./dist/server'),
    publicPath: '/',
    ...(process.env.MODE !== 'production' ? { library: '[name]', libraryTarget: 'umd' } : {})
  },
  module: {
    rules: [
      {
        use: [
          path.resolve('./src/libraries/webpack-utils/style-loader/loader.ts'),
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          'postcss-loader'
        ],
        test: /\.css?$/
      },
      {
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          plugins: [
            'babel-plugin-macros'
          ],
          presets: [
            '@babel/preset-typescript',
            '@babel/preset-react',
            [
              '@babel/preset-env',
              {
                targets: 'node 8'
              }
            ]
          ]
        },
        test: /\.tsx?$/
      }
    ]
  },
  name: 'server',
  plugins: [
    new CleanWebpackPlugin([path.resolve('./dist/server')])
  ],
  target: 'node'
}

export default [client, server]
