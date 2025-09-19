const { join } = require('path');
const { getMainFields } = require('@nativescript/webpack');

module.exports = (env) => {
  const platform = env && ((env.android && 'android') || (env.ios && 'ios') || (env.web && 'web'));
  const mainFields = getMainFields(platform);

  return {
    mode: 'production',
    entry: {
      bundle: join(__dirname, 'src/main.ts'),
    },
    output: {
      path: join(__dirname, 'dist'),
      filename: '[name].js',
    },
    resolve: {
      mainFields,
      extensions: ['.ts', '.js'],
      alias: {
        '@': join(__dirname, 'src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: [
            {
              loader: 'ts-loader',
              options: {
                configFile: join(__dirname, 'tsconfig.json'),
              },
            },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};
