import {Header} from '@shopify/network';
import {Assets, middleware} from '@shopify/sewing-kit-koa';
import {Context} from 'koa';

import {assetsUrl, storefrontModulesUrl} from '../config/server';

export const assets = middleware({
  assetPrefix: assetsUrl,
  caching: false,
});

const STOREFRONT_MODULES_ASSETS = Symbol('storefront-modules');

export function getStorefrontModulesAssets(ctx: Context): Assets {
  return (ctx.state as any)[STOREFRONT_MODULES_ASSETS];
}

export function setStorefrontModulesAssets(ctx: Context, assets: Assets) {
  (ctx.state as any)[STOREFRONT_MODULES_ASSETS] = assets;
}

export const storefrontModules = async (ctx: Context, next: () => void) => {
  const assets = new Assets({
    caching: false,
    assetPrefix: storefrontModulesUrl,
    userAgent: ctx.get(Header.UserAgent),
    manifestPath: 'build/storefront-modules/assets.json',
  });

  setStorefrontModulesAssets(ctx, assets);

  await next();
};
