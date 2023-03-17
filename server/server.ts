import Koa from 'koa';

import {reactAppMiddleware} from './react-app';
import {assets, storefrontModules} from './assets';

const app = new Koa();
app.use(assets);
app.use(storefrontModules);
app.use(reactAppMiddleware);

export default app;
