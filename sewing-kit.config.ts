/* eslint-env node */

import {join} from 'path';

import {Env, Plugins} from '@shopify/sewing-kit';

import {assetsUrl, ip, port} from './config/server';

interface EntriesObject {
  [key: string]: string | string[];
}

module.exports = function sewingKitConfig(plugins: Plugins, env: Env) {
  const entryPoints: EntriesObject = {
    main: [join(__dirname, env.target)],
  };

  if (env.isClient) {
    entryPoints.storefrontModules = join(
      __dirname,
      'client/storefront-modules.ts',
    );
  }

  return {
    name: 'online-store-web',
    plugins: [
      plugins.entry(entryPoints),
      plugins.devServer({ip, port}),
      plugins.cdn(assetsUrl),
      plugins.features({
        webpackIncludeCaseSensitivePathsPlugin: false,
        webpackIncludePersistedGraphQLPlugin: false,
      }),
      plugins.experiments({
        experimentalUseImportModule: true,
        webpackBackCompat: true,
        webpackDevelopmentCache: true,
        dartSassLoader: true,
      }),
      plugins.webpack((config) => {
        if (env.isClient && env.isDevelopment) {
          config.optimization.runtimeChunk = 'single';
        }

        if (config?.optimization?.minimizer) {
          const terserPlugin = config.optimization.minimizer.find(
            (plugin) => plugin.constructor.name === 'TerserPlugin',
          );

          if (terserPlugin) {
            terserPlugin.options.terserOptions = {
              ...terserPlugin.options.terserOptions,
              safari10: false,
              mangle: true,
            };
          }
        }

        if (env.isClient && env.hasProductionAssets) {
          config.optimization.runtimeChunk = 'multiple';
          // Increases maximum number of parallel requests at an entry point
          config.optimization.splitChunks.maxInitialRequests = 10;
          // Increases maximum number of parallel requests when on-demand loading
          config.optimization.splitChunks.maxAsyncRequests = 10;
          // Decreases the minium number of bytes to create a new bundle
          config.optimization.splitChunks.minSize = 100;

          if (config.optimization.splitChunks.cacheGroups) {
            throw new Error(
              'Sewing kit added cacheGroups. Please adjust `maxInitialRequests` and `maxAsyncRequests` for each cache group',
            );
          } else {
            config.optimization.splitChunks.cacheGroups = {};
          }
        }

        return config;
      }),
    ],
  };
};
