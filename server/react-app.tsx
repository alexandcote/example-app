import React from 'react';
import {Context} from 'koa';
import {getAssets} from '@shopify/sewing-kit-koa';
import {
  Html,
  HtmlContext,
  HtmlManager,
  render,
  Serialize,
} from '@shopify/react-html/server';
import {
  NetworkManager,
  NetworkContext,
  applyToContext,
} from '@shopify/react-network/server';
import {
  AssetTiming,
  AsyncAssetContext,
  AsyncAssetManager,
} from '@shopify/react-async';
import {extract} from '@shopify/react-effect/server';
import {HydrationManager, HydrationContext} from '@shopify/react-hydrate';
import {App} from 'foundation/App';

import {getStorefrontModulesAssets} from './assets';

export async function reactAppMiddleware(ctx: Context) {
  const assets = getAssets(ctx);
  const storefrontModulesAssets = getStorefrontModulesAssets(ctx);

  console.log(storefrontModulesAssets);

  const htmlManager = new HtmlManager();
  const asyncAssets = new AsyncAssetManager();
  const hydrationManager = new HydrationManager();
  const networkManager = new NetworkManager({headers: ctx.headers});

  const immediateAsyncAssets = asyncAssets.used(AssetTiming.Immediate);
  const [styles, scripts, storefrontModules] = await Promise.all([
    assets.styles({name: 'main', asyncAssets: immediateAsyncAssets}),
    assets.scripts({name: 'main', asyncAssets: immediateAsyncAssets}),
    storefrontModulesAssets.scripts({
      name: 'storefrontModules',
      asyncAssets: immediateAsyncAssets,
    }),
  ]);

  const app = <App />;

  await extract(app, {
    maxPasses: 1,
    decorate(app) {
      return (
        <NetworkContext.Provider value={networkManager}>
          <AsyncAssetContext.Provider value={asyncAssets}>
            <HtmlContext.Provider value={htmlManager}>
              <HydrationContext.Provider value={hydrationManager}>
                {app}
              </HydrationContext.Provider>
            </HtmlContext.Provider>
          </AsyncAssetContext.Provider>
        </NetworkContext.Provider>
      );
    },
  });

  applyToContext(ctx, networkManager);

  // Applying the network context can cause a redirect, so we need to
  // bail out if that's the case.
  if (ctx.status >= 300 && ctx.status < 400) {
    return;
  }

  const html = render(
    <Html
      locale="en"
      styles={styles}
      scripts={scripts}
      manager={htmlManager}
      hydrationManager={hydrationManager}
      bodyMarkup={
        <>
          <Serialize id="storefrontModules" data={storefrontModules} />
        </>
      }
    >
      {app}
    </Html>,
  );

  ctx.set('ContentType', 'text/html; charset=utf-8');

  ctx.body = html;
  ctx.status = 200;
}
