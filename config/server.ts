export const ip = '0.0.0.0';
export const port = parseInt(process.env.PORT!, 10) || 3000;
export const isDevelopment = process.env.NODE_ENV === 'development';

const isSpin = Boolean(process.env.SPIN_INSTANCE_FQDN);
const developmentAssetsUrl = isSpin
  ? `https://${process.env.SPIN_INSTANCE_FQDN}/webpack/assets/`
  : `http://localhost:8080/webpack/assets/`;

const developmentStorefrontModulesUrl = isSpin
  ? `https://${process.env.SPIN_INSTANCE_FQDN}/webpack/assets/storefront-modules/`
  : `http://localhost:8080/webpack/assets/storefront-modules/`;

const productionAssetsUrl = isSpin
  ? `https://${process.env.SPIN_INSTANCE_FQDN}/public/cdn/`
  : '';

const productionStorefrontModulesUrl = isSpin
  ? `https://${process.env.SPIN_INSTANCE_FQDN}/public/cdn/storefront-modules/`
  : '';

export const assetsUrl = isDevelopment
  ? developmentAssetsUrl
  : productionAssetsUrl;

export const storefrontModulesUrl = isDevelopment
  ? developmentStorefrontModulesUrl
  : productionStorefrontModulesUrl;
