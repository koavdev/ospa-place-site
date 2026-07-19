// Polyfill mínimo para o prerender (vite-ssg/jsdom): o jsdom não implementa
// window.matchMedia, e o gsap/ScrollTrigger chama matchMedia ao registrar,
// quebrando a renderização SSR das seções animadas. No navegador real
// matchMedia existe, então este stub só atua durante o build estático.
if (typeof window !== 'undefined' && typeof window.matchMedia !== 'function') {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener() {},
    removeListener() {},
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent() {
      return false
    },
  })
}
