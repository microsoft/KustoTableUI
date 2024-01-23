/**
 * This file overrides settings in the webpack config.  If we need to do more customization,
 * we should considering doing an npm run eject.
 */
module.exports = {
  webpack: (config, env) => {
    if (env !== 'development') {
      // Override js and css file names and disable chunking.
      config.output.filename = '[name].js';
      const plugin = config.plugins.find(
        p => p.constructor.name === 'MiniCssExtractPlugin',
      );
      plugin.options.filename = '[name].css';
      config.optimization.runtimeChunk = false;
      config.optimization.splitChunks = {
        cacheGroups: {
          default: false,
        },
      };
    }
    return config;
  },
};
