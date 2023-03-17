export const ip = '0.0.0.0';
export const port = parseInt(process.env.PORT!, 10) || 3000;
export const isDevelopment = process.env.NODE_ENV === 'development';

const isSpin = Boolean(process.env.SPIN_INSTANCE_FQDN);
export const assetsUrl = isSpin
  ? `https://${process.env.SPIN_INSTANCE_FQDN}/webpack/assets/`
  : `http://localhost:8080/webpack/assets/`;

export const storefrontModulesUrl = isSpin
  ? `https://${process.env.SPIN_INSTANCE_FQDN}/webpack/assets/storefront-modules/`
  : `http://localhost:8080/webpack/assets/storefront-modules/`;
