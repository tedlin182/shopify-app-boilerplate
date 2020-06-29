![Shopify App](https://www.custom-gateway.com/wp-content/uploads/2017/03/shopify.png)

#### Shopify App Boilerplate

- Taken from [Shopify App Boilerplate](https://shopify.dev/tutorials/build-a-shopify-app-with-node-and-react)

- Slightly modified to allow for ES6 syntax in `server.js` and other fixes present in the above setup.


#### Shopify App Resources

[Building Shopify Apps](https://shopify.dev/concepts/apps)

[Shopify App Boilerplate](https://shopify.dev/tutorials/build-a-shopify-app-with-node-and-react)

[A loosely related set of packages for JavaScript/TypeScript projects at Shopify](https://github.com/Shopify/quilt)

[Shopify App Bridge](https://shopify.dev/tools/app-bridge/getting-started)

[Shopify App Tools](https://shopify.dev/tools/apps)

[Shopify Demo App Node React](https://github.com/Shopify/shopify-demo-app-node-react)

[Shopify Storefront API GraphQL Explorer](https://shopify.dev/tools/graphiql-storefront-api)

[Shopify Admin API GraphQL Explorer](https://shopify.dev/tools/graphiql-admin-api)

[Manually Add App To Test Store](https://ted-shopify-boilerplate.ngrok.io/auth?shop=teds-awesome-beds-sleep-stuff.myshopify.com/)


### TODO: env-cmd vs dotenv


#### Steps

1. Run `npm i` to install packages
2. To start up locally, run `npm run dev`. This uses `babel-node` to allow for ES6 syntax in `server.js`
3. To run app in Shopify test store, install `ngrok` via `npm i -g ngrok`. Then once you start up your app locally, in a separate terminal window, run `ngrok http <app port number>` and note the ngrok subdomain.
