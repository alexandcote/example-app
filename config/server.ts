export const ip = '0.0.0.0';
export const port = parseInt(process.env.PORT!, 10) || 3000;

const isSpin = Boolean(process.env.SPIN_INSTANCE_FQDN);
export const assetsUrl = isSpin
  ? `https://example-app-cdn.${process.env.SPIN_INSTANCE_FQDN}/webpack/assets/`
  : `http://localhost:8080/webpack/assets/`;
