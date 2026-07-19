<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

typeof gsap.registerPlugin === 'function' && gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['openDemo'])

const sectionRef = ref(null)
const activeCard = ref(null)
let ctx = null

const cases = [
  {
    id: 1,
    title: 'Gêmeo digital para\nbairros planejados',
    description: 'Simular cenários e unificar todos os setores em uma única interface.',
    longtext: 'Plataforma integrada que combina dados territoriais, urbanísticos e de mercado para análise rápida e precisa de viabilidade de empreendimentos imobiliários.',
    tags: 'Incorporadoras | Construtoras',
    population: 'Análise em minutos',
    client: 'Habitasul | Biotic',
    image: '/images/place/market/gemeo.png',
    video_url: '/videos/place/gemeo.mp4'
  },
  {
    id: 2,
    title: 'Inteligência territorial\npara negócios imobiliários',
    description: 'Mapear, organizar e integrar dados para orientar decisões',
    longtext: 'Solução completa para gestão de portfólio imobiliário, integrando dados de performance, riscos e oportunidades em uma única plataforma.',
    tags: 'Fundos Imobiliários | Investidores',
    population: 'Gestão integrada',
    client: 'CBRE | Construtora Tenda',
    image: '/images/place/market/inteligencia.png',
    video_url: '/videos/place/inteligencia.mp4'
  },
  {
    id: 3,
    title: 'Sistema para consulta de\nterrenos em São Paulo,\nPorto Alegre e Recife',
    description: 'Desenvolver estudos de viabilidade financeira e volumétrica em um clique',
    longtext: 'Análise territorial avançada com IA para identificação de oportunidades, precificação de terrenos e análise de cenários de desenvolvimento urbano.',
    tags: 'Developers | Consultores',
    population: 'Decisões baseadas em dados',
    client: '',
    image: '/images/place/market/consulta.png',
    video_url: '/videos/place/consulta.mp4'
  }
]

const logos = [
  '/images/place/market/partners/biotic.png',
  '/images/place/market/partners/cau_rj.jpg',
  '/images/place/market/partners/cbre.svg',
  '/images/place/market/partners/cdl_bh.jpg',
  '/images/place/market/partners/ey.png',
  '/images/place/market/partners/habitasul.png',
  '/images/place/market/partners/mota_machado.png',
  '/images/place/market/partners/tenda.png'
]

const handleCardClick = (cardId) => {
  activeCard.value = cardId
}

const closeCard = () => {
  activeCard.value = null
}

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (!sectionRef.value) return
      
      const elements = sectionRef.value.querySelectorAll('.animate-case')
      if (elements.length === 0) return
      
      ctx = gsap.context(() => {
        gsap.from(elements, {
          scrollTrigger: {
            trigger: sectionRef.value,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
          },
          opacity: 0,
          y: 40,
          duration: 0.6,
          stagger: 0.15
        })
      }, sectionRef.value)
    }, 100)
  })
})

onUnmounted(() => {
  if (ctx) ctx.revert()
})
</script>

<template>
  <section ref="sectionRef" id="market-features" class="min-h-screen w-full relative bg-stone-50 flex flex-col justify-between">
    <div class="container mx-auto mt-10 px-6 py-20 relative z-10 flex-grow">
      
      <div class="mb-12 md:mb-16">
        <h2 class="text-zinc-900 text-xl md:text-2xl font-light font-['Manrope'] leading-8">
          Soluções para o mercado<br /> imobiliário e investidores
        </h2>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <!-- Card 1 -->
        <div class="grid grid-cols-1 grid-rows-1 h-full relative group">
          <div 
            class="col-start-1 row-start-1 animate-case bg-white rounded-[20px] p-5 overflow-hidden flex flex-col cursor-pointer hover:bg-teal-800 transition-all duration-500 z-10"
            :class="{ 'bg-teal-800': activeCard === 1 }"
            :style="{ opacity: activeCard !== null && activeCard !== 1 ? 0 : '', pointerEvents: activeCard !== null && activeCard !== 1 ? 'none' : '' }"
            @click="handleCardClick(1)"
          >
            <div class="w-full h-auto mb-4 bg-neutral-100 overflow-hidden rounded-[20px]">
              <img v-if="activeCard !== 1" class="w-full h-full object-cover" :src="cases[0].image" :alt="cases[0].title" />
              <video v-else class="w-full h-full object-cover" autoplay muted loop playsinline>
                <source :src="cases[0].video_url" type="video/mp4">
              </video>
            </div>
            
            <div class="flex flex-col flex-grow">
              <h3 class="text-zinc-900 group-hover:text-stone-50 text-xl font-medium font-['Manrope'] leading-6 mb-4 whitespace-pre-line transition-colors duration-500"
                  :class="{ 'text-stone-50': activeCard === 1 }">
                {{ cases[0].title }}
              </h3>
              <p class="text-neutral-500 group-hover:text-stone-50 text-lg font-light font-['Manrope'] leading-6 mb-4 flex-grow transition-colors duration-500"
                 :class="{ 'text-stone-50': activeCard === 1 }">
                {{ cases[0].description }}
              </p>
              <p class="text-neutral-500 group-hover:text-stone-50 text-xs font-light font-['Manrope'] leading-5 mb-6 transition-colors duration-500"
                 :class="{ 'text-stone-50': activeCard === 1 }">
                {{ cases[0].tags }}
              </p>
              <div class="space-y-2">
                <p class="text-zinc-900 group-hover:text-stone-50 text-base font-normal font-['Manrope'] leading-6 transition-colors duration-500"
                   :class="{ 'text-stone-50': activeCard === 1 }">
                  {{ cases[0].population }}
                </p>
                <p class="text-zinc-900 group-hover:text-stone-50 text-base font-light font-['Manrope'] leading-6 transition-colors duration-500"
                   :class="{ 'text-stone-50': activeCard === 1 }">
                  {{ cases[0].client }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Card 2 + Text overlays -->
        <div class="grid grid-cols-1 grid-rows-1 h-full relative group">
          <div 
            class="col-start-1 row-start-1 animate-case bg-white rounded-[20px] p-5 overflow-hidden flex flex-col cursor-pointer hover:bg-teal-800 transition-all duration-500 z-10"
            :class="{ 'bg-teal-800': activeCard === 2 }"
            :style="{ opacity: activeCard !== null && activeCard !== 2 ? 0 : '', pointerEvents: activeCard !== null && activeCard !== 2 ? 'none' : '' }"
            @click="handleCardClick(2)"
          >
            <div class="w-full h-auto mb-4 bg-neutral-100 overflow-hidden rounded-[20px]">
              <img v-if="activeCard !== 2" class="w-full h-full object-cover" :src="cases[1].image" :alt="cases[1].title" />
              <video v-else class="w-full h-full object-cover" autoplay muted loop playsinline>
                <source :src="cases[1].video_url" type="video/mp4">
              </video>
            </div>
            
            <div class="flex flex-col flex-grow">
              <h3 class="text-zinc-900 group-hover:text-stone-50 text-xl font-medium font-['Manrope'] leading-6 mb-4 whitespace-pre-line transition-colors duration-500"
                  :class="{ 'text-stone-50': activeCard === 2 }">
                {{ cases[1].title }}
              </h3>
              <p class="text-neutral-500 group-hover:text-stone-50 text-lg font-light font-['Manrope'] leading-6 mb-4 flex-grow transition-colors duration-500"
                 :class="{ 'text-stone-50': activeCard === 2 }">
                {{ cases[1].description }}
              </p>
              <p class="text-neutral-500 group-hover:text-stone-50 text-xs font-light font-['Manrope'] leading-5 mb-6 transition-colors duration-500"
                 :class="{ 'text-stone-50': activeCard === 2 }">
                {{ cases[1].tags }}
              </p>
              <div class="space-y-2">
                <p class="text-zinc-900 group-hover:text-stone-50 text-base font-normal font-['Manrope'] leading-6 transition-colors duration-500"
                   :class="{ 'text-stone-50': activeCard === 2 }">
                  {{ cases[1].population }}
                </p>
                <p class="text-zinc-900 group-hover:text-stone-50 text-base font-light font-['Manrope'] leading-6 transition-colors duration-500"
                   :class="{ 'text-stone-50': activeCard === 2 }">
                  {{ cases[1].client }}
                </p>
              </div>
            </div>
          </div>

          <!-- Text Card 1 -->
          <div 
            class="col-start-1 row-start-1 flex items-center justify-center p-6 z-20 transition-opacity duration-500 relative"
            :class="activeCard === 1 ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <button class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors" @click.stop="closeCard">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div class="w-full text-zinc-900 text-left">
              <p class="text-lg font-light font-['Manrope'] leading-relaxed mb-4">{{ cases[0].longtext }}</p>
            </div>
          </div>

          <!-- Text Card 3 -->
          <div 
            class="col-start-1 row-start-1 flex items-center justify-center p-6 z-20 transition-opacity duration-500 relative"
            :class="activeCard === 3 ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <button class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors" @click.stop="closeCard">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div class="w-full text-zinc-900 text-right">
              <p class="text-lg font-light font-['Manrope'] leading-relaxed mb-4">{{ cases[2].longtext }}</p>
            </div>
          </div>
        </div>

        <!-- Card 3 + Text overlay -->
        <div class="grid grid-cols-1 grid-rows-1 h-full relative group">
          <div 
            class="col-start-1 row-start-1 animate-case bg-white rounded-[20px] p-5 overflow-hidden flex flex-col cursor-pointer hover:bg-teal-800 transition-all duration-500 z-10"
            :class="{ 'bg-teal-800': activeCard === 3 }"
            :style="{ opacity: activeCard !== null && activeCard !== 3 ? 0 : '', pointerEvents: activeCard !== null && activeCard !== 3 ? 'none' : '' }"
            @click="handleCardClick(3)"
          >
            <div class="w-full h-auto mb-4 bg-neutral-100 overflow-hidden rounded-[20px]">
              <img v-if="activeCard !== 3" class="w-full h-full object-cover" :src="cases[2].image" :alt="cases[2].title" />
              <video v-else class="w-full h-full object-cover" autoplay muted loop playsinline>
                <source :src="cases[2].video_url" type="video/mp4">
              </video>
            </div>
            
            <div class="flex flex-col flex-grow">
              <h3 class="text-zinc-900 group-hover:text-stone-50 text-xl font-medium font-['Manrope'] leading-6 mb-4 whitespace-pre-line transition-colors duration-500"
                  :class="{ 'text-stone-50': activeCard === 3 }">
                {{ cases[2].title }}
              </h3>
              <p class="text-neutral-500 group-hover:text-stone-50 text-lg font-light font-['Manrope'] leading-6 mb-4 flex-grow transition-colors duration-500"
                 :class="{ 'text-stone-50': activeCard === 3 }">
                {{ cases[2].description }}
              </p>
              <p class="text-neutral-500 group-hover:text-stone-50 text-xs font-light font-['Manrope'] leading-5 mb-6 transition-colors duration-500"
                 :class="{ 'text-stone-50': activeCard === 3 }">
                {{ cases[2].tags }}
              </p>
              <div class="space-y-2">
                <p class="text-zinc-900 group-hover:text-stone-50 text-base font-normal font-['Manrope'] leading-6 transition-colors duration-500"
                   :class="{ 'text-stone-50': activeCard === 3 }">
                  {{ cases[2].population }}
                </p>
                <p class="text-zinc-900 group-hover:text-stone-50 text-base font-light font-['Manrope'] leading-6 transition-colors duration-500"
                   :class="{ 'text-stone-50': activeCard === 3 }">
                  {{ cases[2].client }}
                </p>
              </div>
            </div>
          </div>

          <!-- Text Card 2 -->
          <div 
            class="col-start-1 row-start-1 flex items-center justify-center p-6 z-20 transition-opacity duration-500 relative"
            :class="activeCard === 2 ? 'opacity-100' : 'opacity-0 pointer-events-none'"
          >
            <button class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors" @click.stop="closeCard">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
            <div class="w-full text-zinc-900 text-left">
              <p class="text-lg font-light font-['Manrope'] leading-relaxed mb-4">{{ cases[1].longtext }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="flex justify-center">
        <button 
          @click="emit('openDemo')"
          class="w-full md:w-60 h-9 rounded-[20px] border-[0.50px] border-neutral-500 flex items-center justify-center hover:bg-neutral-500 hover:text-white transition-colors group cursor-pointer uppercase"
        >
          <span class="text-neutral-500 text-base font-light font-['Manrope'] leading-8 group-hover:text-white transition-colors uppercase">agendar</span>
        </button>
      </div>
    </div>

    <!-- Logos Carousel -->
    <div class="w-full py-8 border-t border-gray-200/50 shrink-0">
      <div class="logos-scroll">
        <div class="logos-track">
          <img v-for="(logo, index) in [...logos, ...logos]" :key="index" class="logo-item w-48 h-14 object-contain" :src="logo" alt="Logo" />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.logos-scroll {
  width: 100%;
  overflow: hidden;
  position: relative;
}

.logos-track {
  display: flex;
  align-items: center;
  gap: 3.5rem;
  opacity: 0.3;
  animation: scroll-logos 30s linear infinite;
  width: fit-content;
}

.logo-item {
  flex-shrink: 0;
}

@keyframes scroll-logos {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.logos-scroll:hover .logos-track {
  animation-play-state: paused;
}
</style>
