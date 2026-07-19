import './ssr-polyfill.js'
import { ViteSSG } from 'vite-ssg'
import './style.css'
import App from './App.vue'
import { routes } from './router/routes'

export const createApp = ViteSSG(
  App,
  { routes },
  ({ router, isClient }) => {
    if (!isClient) return

    router.afterEach((to) => {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', 'G-V1R21WYN53', {
          page_path: to.path,
          page_title: to.name || document.title,
          page_location: window.location.href
        })
      }
      if (typeof window.dataLayer !== 'undefined') {
        window.dataLayer.push({
          event: 'pageview',
          page: {
            path: to.path,
            title: to.name || document.title,
            url: window.location.href
          }
        })
      }
    })
  }
)
