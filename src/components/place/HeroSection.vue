<script setup>
import { onMounted, ref } from 'vue'
import gsap from 'gsap'

const emit = defineEmits(['openContactModal'])

const heroLeftContent = ref(null)
const heroTopCards = ref(null)
const heroVideoWrapper = ref(null)
const heroBottomCard = ref(null)
const dataCount = ref(0)
const userCount = ref(0)
const landCount = ref(0)

// Video from public folder
const videoSrc = '/videos/place.mp4'

onMounted(() => {
  const title = heroLeftContent.value.querySelector('h1')
  const subtitle = heroLeftContent.value.querySelector('p')
  const buttons = heroLeftContent.value.querySelector('div:last-child')
  const video = heroVideoWrapper.value.querySelector('#hero-video')
  
  // Set initial states
  gsap.set([heroTopCards.value, title, subtitle, buttons, heroBottomCard.value], { 
    opacity: 0 
  })
  
  // Video animation first
  gsap.to(video, {
    opacity: 1,
    scale: 1,
    duration: 1.5,
    delay: 1,
    ease: 'power2.out',
    startAt: { opacity: 0, scale: 0.95 }
  })
  
  // Wait for video animation to complete (1s delay + 1s reduce + 0.3s pause + 0.8s move + 1.5s extra = 4.6s)
  const tl = gsap.timeline({ delay: 4.6 })

  // Cards from top
  tl.to(heroTopCards.value, { 
    opacity: 1, 
    y: 0, 
    duration: 0.8, 
    ease: 'power2.out',
    startAt: { y: -50 }
  })
  
  // Title from left
  .to(title, { 
    opacity: 1, 
    x: 0, 
    duration: 0.8, 
    ease: 'power2.out',
    startAt: { x: -60 }
  }, '-=0.4')
  
  // Subtitle from bottom
  .to(subtitle, { 
    opacity: 1, 
    y: 0, 
    duration: 0.6, 
    ease: 'power2.out',
    startAt: { y: 30 }
  }, '-=0.4')
  
  // Buttons from bottom
  .to(buttons, { 
    opacity: 1, 
    y: 0, 
    duration: 0.6, 
    ease: 'power2.out',
    startAt: { y: 30 }
  }, '-=0.3')
  
  // Bottom card appears
  .to(heroBottomCard.value, { 
    opacity: 1, 
    y: 0, 
    duration: 0.6, 
    ease: 'power2.out',
    startAt: { y: 30 }
  }, '-=0.3')
  
  // Counter animations (starts with more delay)
  .to(dataCount, {
    value: 20,
    duration: 2,
    delay: 0.5,
    ease: 'power2.out',
    onUpdate: () => {
      dataCount.value = Math.floor(dataCount.value)
    }
  }, '-=1.5')
  .to(userCount, {
    value: 60,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      userCount.value = Math.floor(userCount.value)
    }
  }, '-=2')
  .to(landCount, {
    value: 2,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      landCount.value = Math.floor(landCount.value)
    }
  }, '-=2')
})
</script>

<template>
  <section id="home" data-header-style="default" class="min-h-screen w-full bg-stone-50 flex items-center justify-center py-20 md:py-32 lg:py-40">
    <div class="container mx-auto px-4 sm:px-6 h-full flex items-center">
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] gap-8 md:gap-12 lg:gap-16 xl:gap-20 w-full items-center">
        
        <!-- Left Column -->
        <div ref="heroLeftContent" class="flex flex-col gap-6 md:gap-8 items-start lg:max-w-[90%]">
          <h1 class="w-full text-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium font-['Manrope'] !leading-[1.15] opacity-0">
            Simplificar a<br />gestão urbana<br />e imobiliária
          </h1>
          <p class="w-full text-neutral-500 text-lg sm:text-xl md:text-2xl font-light font-['Manrope'] leading-relaxed opacity-0">
            Gêmeo Digital Urbano
          </p>
          <div class="flex flex-row gap-3 md:gap-4 flex-wrap opacity-0">
            <a 
              href="#government"
              class="px-6 py-2 rounded-[20px] border-[0.50px] border-neutral-500 text-neutral-500 text-sm md:text-base font-light font-['Manrope'] cursor-pointer hover:bg-neutral-500 hover:text-white transition-colors uppercase"
            >
              governos
            </a>
            <a 
              href="#market"
              class="px-6 py-2 rounded-[20px] border-[0.50px] border-neutral-500 text-neutral-500 text-sm md:text-base font-light font-['Manrope'] cursor-pointer hover:bg-neutral-500 hover:text-white transition-colors uppercase"
            >
              mercado
            </a>
          </div>
        </div>

        <!-- Right Column -->
        <div class="flex flex-col gap-3 md:gap-4 items-start relative z-10">
          <div ref="heroTopCards" class="flex gap-3 md:gap-4 w-full relative z-10 h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 opacity-0">
            <div class="flex-1 bg-teal-700 rounded-[20px] p-4 md:p-5 flex flex-col justify-center items-center text-center h-full">
              <div class="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium font-['Manrope'] mb-1">
                +{{ dataCount }}m
              </div>
              <div class="text-white text-sm sm:text-base font-light font-['Manrope']">dados tratados</div>
            </div>
            <div class="flex-1 bg-teal-900 rounded-[20px] p-4 md:p-5 flex flex-col justify-center items-center text-center h-full">
              <div class="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium font-['Manrope'] mb-1">
                +{{ userCount }}k
              </div>
              <div class="text-white text-sm sm:text-base font-light font-['Manrope']">usuários<br />impactados</div>
            </div>
          </div>

          <div id="hero-video-wrapper" ref="heroVideoWrapper" class="w-full relative z-10 h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64">
            <video 
              id="hero-video"
              class="w-full h-full rounded-[20px] object-cover" 
              autoplay 
              muted 
              loop 
              playsinline
              poster="/images/place/video-poster.png"
              style="opacity: 0;"
            >
              <source :src="videoSrc" type="video/mp4">
            </video>
          </div>

          <div ref="heroBottomCard" class="w-full bg-teal-800 rounded-[20px] p-4 md:p-5 flex flex-row gap-3 md:gap-4 justify-center items-center text-center h-32 sm:h-40 md:h-48 lg:h-56 xl:h-64 opacity-0">
            <div class="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium font-['Manrope']">
              +{{ landCount }}m
            </div>
            <div class="text-white text-left text-sm sm:text-base md:text-lg font-light font-['Manrope']">
              terrenos<br />analisados
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
