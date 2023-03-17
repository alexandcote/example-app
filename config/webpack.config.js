/* eslint-env node */

const path = require('path');

const {Env} = require('@shopify/sewing-kit');
const {BrowserGroup} = require('@shopify/build-targets');
const WebpackShellPluginNext = require('webpack-shell-plugin-next');
const {default: Runner} = require('@shopify/sewing-kit/dist/src/runner');
const {
  loadBuildWorkspace,
} = require('@shopify/sewing-kit/dist/src/tools/webpack/config/build-workspace');
const {
  default: webpackConfig,
} = require('@shopify/sewing-kit/dist/src/tools/webpack/config');

const ROOT_DIR = path.resolve(__dirname, '..');

const buildTarget = {
  dev: {
    name: 'dev',
    browsers: BrowserGroup.LatestEvergreen,
    locales: [],
  },
  baseline: {
    name: 'baseline',
    browsers: BrowserGroup.Baseline,
    locales: [],
  },
  latest: {
    name: 'latest',
    browsers: BrowserGroup.LatestEvergreen,
    locales: [],
  },
};

async function getWebpackConfig(mode, browser) {
  const workspace = await loadBuildWorkspace(
    new Env({target: 'client', mode}),
    new Runner(),
    buildTarget[browser],
    {},
  );
  return webpackConfig(workspace, {});
}

module.exports = (_, options) => {
  const mode = options.mode || 'development';
  const defaultBrowser = mode === 'development' ? 'dev' : 'latest';

  const browser = process.env.BROWSER_TARGET || defaultBrowser;
  return getWebpackConfig(mode, browser)
    .then((config) => {
      updateEntries(config);
      updateCacheDirectory(config);
      updateOutputDirectory(config);
      usePreactInsteadOfReact(config);
      updateManifestPath(config, browser);
      setupDevServer(config);
      consolidateManifest(config);

      return config;
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
};

function updateManifestPath(config, browser) {
  const assetMetadataPlugin = config.plugins.find(
    (plugin) => plugin.constructor.name === 'AssetMetadataPlugin',
  );

  assetMetadataPlugin.options.filename = `${browser}/assets.json`;
}

function updateCacheDirectory(config) {
  config.cache.cacheDirectory = path.resolve(
    ROOT_DIR,
    `build/cache/webpack/storefront-modules-cache`,
  );
}

function updateOutputDirectory(config) {
  const publicPath = new URL(config.output.publicPath);
  publicPath.pathname = '/webpack/assets/storefront-modules/';
  config.output = {
    ...config.output,
    path: path.resolve(ROOT_DIR, 'build', 'storefront-modules'),
    publicPath: publicPath.toString(),
  };
}

function usePreactInsteadOfReact(config) {
  config.resolve.alias.react = 'preact/compat';
}

function updateEntries(config) {
  config.entry = {
    storefrontModules: path.resolve(ROOT_DIR, 'client/storefront-modules.ts'),
  };
}

function setupDevServer(config) {
  config.devServer = {
    hot: false,
    liveReload: false,
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    watchFiles: ['packages/@editor/storefront-controller/**/*'],
    static: {
      directory: path.join(ROOT_DIR, 'build', 'storefront-modules'),
      publicPath: '/webpack/assets/storefront-modules',
    },
    compress: true,

    port: process.env.STOREFRONT_MODULES_PORT || 8083,
  };
}

function consolidateManifest(config) {
  config.plugins = [
    ...config.plugins,
    new WebpackShellPluginNext({
      dev: true,
      onAfterDone: {
        scripts: [
          'echo "Executing plugin"',
          'yarn run manifests consolidate --root build/storefront-modules --destination build/storefront-modules/assets.json --removeLegacyData',
        ],
        blocking: true,
        parallel: false,
      },
    }),
  ];
}
