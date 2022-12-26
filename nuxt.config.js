import axios from 'axios';
import { createClient } from 'microcms-js-sdk'
export default {
  // Target: https://go.nuxtjs.dev/config-target
  target: 'static',

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: 'nuxt-generate-test',
    htmlAttrs: {
      lang: 'en',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios'
  ],

  // Axios module configuration: https://go.nuxtjs.dev/config-axios
  axios: {
    // Workaround to avoid enforcing hard-coded localhost:3000: https://github.com/nuxt-community/axios-module/issues/308
    baseURL: 'http://localhost:3000/'
  },

  generate:{
    interval: 100,
    async routes(){
      const microcms = createClient({
        serviceDomain: process.env.MICROCMS_DOMAIN,
        apiKey: process.env.MICROCMS_API_KEY
      })
      const fields = [
        'studio_id',
        'rooms.id',
        'banner.boolean',
        'banner.image.url',
        'banner.alt',
        'notice.boolean',
        'notice.body',
        'images',
        'map'
      ]
      const getTotalCount = await 
        microcms.get({
          endpoint: process.env.END_POINT,
          queries: {
            limit: 0
          }
        })
        .then((response) => {
          return response.totalCount
        })
      const getShopsRoutes = await 
        microcms.get({
          endpoint: process.env.END_POINT,
          queries: {
            limit: getTotalCount,
            fields: fields.join(',')
          }
        })
        .then((shops) => {
          const routes = []
          shops.contents.forEach(shop => {
            routes.push(
              {
                route: `/shoplist/shop/${shop.studio_id}`,
                payload: shop
              }
            )
          })
          return routes
        })
      const getShops = await 
        microcms.get({
          endpoint: process.env.END_POINT,
          queries: {
            limit: getTotalCount,
            fields: fields.join(',')
          }
        })
        .then((shops) => {
          return shops.contents
        })
      return [
        {
          route:"/shoplist/shop",
          payload: getShops
        }
      ].concat(getShopsRoutes)
    }
  },

  microcms: {
    options: {
      serviceDomain: process.env.MICROCMS_DOMAIN,
      apiKey: process.env.MICROCMS_API_KEY
    },
    mode: process.env.NODE_ENV === 'production' ? 'client' : 'all'
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {},

  publicRuntimeConfig: {
    qiitaToken: process.env.QIITA_TOKEN
  }
}
