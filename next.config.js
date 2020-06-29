import dotenv from 'dotenv'
import withCSS from '@zeit/next-css'
import webpack from 'webpack'

dotenv.config()

const {
  SHOPIFY_API_KEY,
  SHOPIFY_API_SECRET,
  HOST,
} = process.env

module.exports = withCSS({
  webpack: (config) => {
    const env = { SHOPIFY_API_KEY };
    config.plugins.push(new webpack.DefinePlugin(env));
    return config;
  },
  env: {
    SHOPIFY_API_KEY,
    SHOPIFY_API_SECRET,
    HOST,
  },
});
