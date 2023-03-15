import {ip, port} from '../config/server';

import app from './server';

app.listen(port, ip, () => {
  // eslint-disable-next-line no-console
  console.log(`[init] listening on ${ip}:${port}`);
});
