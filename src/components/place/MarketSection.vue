<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

typeof gsap.registerPlugin === 'function' && gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['openDemo'])

const sectionRef = ref(null)
const activeIndex = ref(0)
const isMobile = ref(false)
let ctx = null

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const solutions = [
  { 
    title: 'Transformar', 
    description: 'desafios complexos em soluções desenhadas a partir das dores reais de cada operação.',
    image: '/images/place/market/b2b_transformar.png'
  },
  { 
    title: 'Integrar', 
    description: 'dados internos e externos, com normas urbanísticas, projetos e tendências de mercado.',
    image: '/images/place/market/b2b_integrar.png'
  },
  { 
    title: 'Qualificar', 
    description: 'tomadas de decisões de forma ágil, precisa e estratégica sobre ativos imobiliários.',
    image: '/images/place/market/b2b_qualificar.png'
  },
  { 
    title: 'Escalar', 
    description: 'processos e operações internas em um sistema de gestão territorial unificado, visual e digital.',
    image: '/images/place/market/b2b_escalar.png'
  }
]

let autoplayTimer = null

const stopAutoplay = () => {
  if (autoplayTimer) {
    clearInterval(autoplayTimer)
    autoplayTimer = null
  }
}

const startAutoplay = () => {
  stopAutoplay()
  autoplayTimer = setInterval(() => {
    activeIndex.value = (activeIndex.value + 1) % solutions.length
  }, 1500)
}

const toggleItem = (index) => {
  activeIndex.value = index
  startAutoplay()
}

const nextItem = () => {
  if (activeIndex.value < solutions.length - 1) {
    activeIndex.value++
    startAutoplay()
  }
}

const prevItem = () => {
  if (activeIndex.value > 0) {
    activeIndex.value--
    startAutoplay()
  }
}

// Touch handling for mobile swipe
const touchStartX = ref(0)
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
}

const handleTouchEnd = (e) => {
  const diff = touchStartX.value - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) {
    if (diff > 0) nextItem()
    else prevItem()
  }
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)

  nextTick(() => {
    setTimeout(() => {
      if (!sectionRef.value) return
      
      ctx = gsap.context(() => {
        gsap.from('.animate-solution-text', {
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          x: 40,
          duration: 0.6,
          stagger: 0.1
        })

        gsap.from('.animate-solution-image', {
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          x: -40,
          duration: 0.8
        })
      }, sectionRef.value)
    }, 100)
  })

  startAutoplay()
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  if (ctx) ctx.revert()
  stopAutoplay()
})
</script>

<template>
  <section 
    ref="sectionRef" 
    id="market" 
    data-header-style="default" 
    class="min-h-screen w-full relative flex items-center overflow-hidden"
  >
    <!-- Mobile Layout -->
    <div v-if="isMobile" class="w-full h-full flex flex-col px-6 py-16">
      <!-- Header -->
      <div class="mb-6">
        <p class="text-neutral-500 text-base font-light font-['Manrope'] mb-2">MERCADO</p>
        <h2 class="text-zinc-900 text-xl font-medium font-['Manrope']">
          Com o gêmeo digital é possível:
        </h2>
      </div>

      <!-- Carousel -->
      <div 
        class="flex-1 relative"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- Image -->
        <div class="w-full h-48 rounded-[20px] overflow-hidden mb-4 relative">
          <img 
            v-for="(solution, index) in solutions"
            :key="solution.title"
            class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" 
            :class="activeIndex === index ? 'opacity-100' : 'opacity-0'"
            :src="solution.image" 
            :alt="solution.title"
          />
        </div>

        <!-- Content -->
        <div class="mb-4">
          <h3 class="text-zinc-900 text-2xl font-medium font-['Manrope'] mb-3">
            {{ solutions[activeIndex].title }}
          </h3>
          <p class="text-neutral-500 text-base font-light font-['Manrope'] leading-6">
            {{ solutions[activeIndex].description }}
          </p>
        </div>

        <!-- Navigation arrows -->
        <div class="flex justify-between items-center mb-4">
          <button 
            v-if="activeIndex > 0"
            @click="prevItem"
            class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15,18 9,12 15,6"></polyline>
            </svg>
          </button>
          <div v-else class="w-10"></div>
          
          <span class="text-neutral-400 text-sm">{{ activeIndex + 1 }} / {{ solutions.length }}</span>
          
          <button 
            v-if="activeIndex < solutions.length - 1"
            @click="nextItem"
            class="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-md"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9,6 15,12 9,18"></polyline>
            </svg>
          </button>
          <div v-else class="w-10"></div>
        </div>
      </div>

      <!-- CTA Button -->
      <button 
        @click="emit('openDemo')"
        class="w-full px-6 h-10 rounded-[20px] border border-neutral-500 text-neutral-500 text-base font-light font-['Manrope'] hover:bg-neutral-500 hover:text-white transition-colors cursor-pointer uppercase"
      >
        <span class="uppercase">agendar</span>
      </button>
    </div>

    <!-- Desktop Layout -->
    <div v-else class="w-full h-full flex">
      
      <!-- Left: Image -->
      <div class="animate-solution-image w-[58%] h-[640px] my-auto bg-white rounded-r-[5px] overflow-hidden flex-shrink-0 relative">
        <img 
          v-for="(solution, index) in solutions"
          :key="solution.title"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500" 
          :class="activeIndex === index ? 'opacity-100' : 'opacity-0'"
          :src="solution.image" 
          :alt="solution.title"
        />
      </div>

      <!-- Right: Accordion -->
      <div class="flex-1 h-[640px] flex">
        <div class="pl-16 pr-6 lg:pl-20 lg:pr-12 w-full max-w-lg flex flex-col">
          
          <!-- Header - aligned to top -->
          <div class="animate-solution-text mb-8">
            <p class="text-neutral-500 text-lg font-light font-['Manrope'] leading-6 mb-2">MERCADO</p>
            <h2 class="text-zinc-900 text-2xl lg:text-3xl font-medium font-['Manrope']">
              Com o gêmeo<br />digital é possível:
            </h2>
          </div>

          <!-- Accordion Items - centered vertically -->
          <div class="flex-1 flex items-center">
            <div class="space-y-2 w-full">
              <div 
                v-for="(solution, index) in solutions" 
                :key="solution.title"
                class="animate-solution-text"
              >
                <Transition
                  name="carousel-vertical"
                  mode="out-in"
                >
                  <!-- Title (hidden when active) -->
                  <button
                    v-if="activeIndex !== index"
                    key="collapsed"
                    @click="toggleItem(index)"
                    class="w-full text-left text-neutral-400 hover:text-neutral-600 transition-colors duration-200 py-2 flex items-center gap-3 group cursor-pointer"
                  >
                    <svg class="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span class="text-base font-normal font-['Manrope'] leading-6">
                      {{ solution.title }}
                    </span>
                  </button>

                  <!-- Expanded Content (replaces title when active) -->
                  <div
                    v-else
                    key="expanded"
                  >
                    <h3 class="text-zinc-900 text-3xl font-medium font-['Manrope'] leading-10 mb-6">
                      {{ solution.title }}
                    </h3>
                    <p class="text-neutral-500 text-lg font-light font-['Manrope'] leading-6">
                      {{ solution.description }}
                    </p>
                  </div>
                </Transition>
              </div>
            </div>
          </div>

          <!-- CTA Button - aligned to bottom -->
          <button 
            @click="emit('openDemo')"
            class="animate-solution-text mt-12 px-6 h-9 rounded-[20px] border border-neutral-500 text-neutral-500 text-base font-light font-['Manrope'] leading-8 hover:bg-neutral-500 hover:text-white transition-colors cursor-pointer uppercase"
          >
            <span class="uppercase">agendar</span>
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.carousel-vertical-enter-active,
.carousel-vertical-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.carousel-vertical-enter-from {
  opacity: 0;
  transform: translateY(16px);
}
.carousel-vertical-leave-to {
  opacity: 0;
  transform: translateY(-16px);
}
</style>
