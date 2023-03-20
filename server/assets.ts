import {middleware} from '@shopify/sewing-kit-koa';

import {assetsUrl, storefrontModulesUrl} from '../config/server';

export const assets = middleware({
  assetPrefix: assetsUrl,
});

export const STOREFRONT_MODULES_ASSETS = Symbol('storefront-modules');
export const storefrontModules = middleware({
  assetPrefix: storefrontModulesUrl,
  manifestPath: 'build/storefront-modules/assets.json',
  key: STOREFRONT_MODULES_ASSETS,
});
