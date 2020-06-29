import 'isomorphic-fetch'
import dotenv from 'dotenv'
import Koa from 'koa'
import next from 'next'
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth'
import session from 'koa-session'

import graphQLProxy, { ApiVersion } from '@shopify/koa-shopify-graphql-proxy'
import Router from '@koa/router'
import { receiveWebhook, registerWebhook } from '@shopify/koa-shopify-webhooks'
import getSubscriptionUrl from './server/getSubscriptionUrl'

dotenv.config()

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const { SHOPIFY_API_SECRET, SHOPIFY_API_KEY, HOST } = process.env

// Add NextJS App
app.prepare()
  .then(() => {
    // Add your routing middleware and koa server
    const server = new Koa()
    const router = new Router()
    server.use(session({ secure: true, sameSite: 'none' }, server))
    server.keys = [SHOPIFY_API_SECRET]
    // Add the createShopifyAuth and verifyRequest middleware
    server.use(
      createShopifyAuth({
        apiKey: SHOPIFY_API_KEY,
        secret: SHOPIFY_API_SECRET,
        scopes: [
          'read_content', 'write_content',
          'read_themes', 'write_themes',
          'read_products', 'write_products',
          'read_product_listings',
          'read_customers', 'write_customers',
          'read_orders', 'write_orders',
          'read_draft_orders', 'write_draft_orders',
          'read_inventory', 'write_inventory',
          'read_locations',
          'read_script_tags', 'write_script_tags',
          'read_fulfillments', 'write_fulfillments',
          'read_assigned_fulfillment_orders', 'write_assigned_fulfillment_orders',
          'read_merchant_managed_fulfillment_orders', 'write_merchant_managed_fulfillment_orders',
          'read_third_party_fulfillment_orders', 'write_third_party_fulfillment_orders',
          'read_shipping', 'write_shipping',
          'read_analytics',
          'read_checkouts', 'write_checkouts',
          'read_reports', 'write_reports',
          'read_price_rules', 'write_price_rules',
          'read_discounts', 'write_discounts',
          'read_marketing_events', 'write_marketing_events',
          'read_resource_feedbacks', 'write_resource_feedbacks',
          'read_shopify_payments_payouts',
          'read_shopify_payments_disputes',
          'read_translations', 'write_translations',
          'read_locales', 'write_locales',
        ],
        async afterAuth(ctx) {
          const { shop, accessToken } = ctx.session
          // Because this app is loaded in an iframe it's important to set your
          // cookies to use sameSite and secure for the app to load in Google Chrome
          ctx.cookies.set('shopOrigin', shop, {
            httpOnly: false,
            secure: true,
            sameSite: 'none'
          })
          const registration = await registerWebhook({
            address: `${HOST}/webhooks/products/create`,
            topic: 'PRODUCTS_CREATE',
            accessToken,
            shop,
            apiVersion: ApiVersion.July20,
          })

          if (registration.success) {
            console.info('Successfully registered webhook!')
          } else {
            console.error('Failed to register webhook', registration.result)
          }
          await getSubscriptionUrl(ctx, accessToken, shop)
        },
      }),
    )

    const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET })

    router.post('/webhooks/products/create', webhook, (ctx) => {
      console.log('received webhook: ', ctx.state.webhook)
    })

    // Add the GraphQL proxy to your middleware chain
    server.use(graphQLProxy({ version: ApiVersion.July20 }))
    router.get('(.*)', verifyRequest(), async (ctx) => {
      await handle(ctx.req, ctx.res)
      ctx.respond = false
      ctx.res.statusCode = 200
    })
    server.use(router.allowedMethods())
    server.use(router.routes())

    server.listen(port, () => {
      console.info(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(err => console.error(err))
