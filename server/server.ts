import Koa from 'koa';
import {middleware as assetsMiddleware} from '@shopify/sewing-kit-koa';

import {assetsUrl} from '../config/server';

import {reactAppMiddleware} from './react-app';

const app = new Koa();
app.use(assetsMiddleware({assetPrefix: assetsUrl}));
app.use(reactAppMiddleware);

export default app;
