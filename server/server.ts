import Koa from 'koa';
import {middleware as assetsMiddleware} from '@shopify/sewing-kit-koa';

import {reactAppMiddleware} from './react-app';

const app = new Koa();
app.use(assetsMiddleware({assetPrefix: 'http://0.0.0.0:8080'}));
app.use(reactAppMiddleware);

export default app;
