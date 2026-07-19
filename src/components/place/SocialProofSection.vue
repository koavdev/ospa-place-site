<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

typeof gsap.registerPlugin === 'function' && gsap.registerPlugin(ScrollTrigger)

const sectionRef = ref(null)
let ctx = null

const testimonials = [
  {
    quote: '"A OSPA capital trouxe organização e velocidade para nossa captação."',
    name: 'João Silva',
    role: 'Diretor financeiro, Incorporadora XYZ'
  },
  {
    quote: '"Finalmente temos visibilidade completa do processo de originação."',
    name: 'Maria Santos',
    role: 'Head de Crédito, Fundo ABC'
  },
  {
    quote: '"A qualidade da análise aumentou significativamente com a plataforma."',
    name: 'Pedro Oliveira',
    role: 'Sócio, Consultoria DEF'
  }
]

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (!sectionRef.value) return
      
      const elements = sectionRef.value.querySelectorAll('.animate-testimonial')
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
  <section ref="sectionRef" id="social-proof" data-header-style="default" class="min-h-screen w-full relative bg-stone-50 flex flex-col">
    
    <!-- Logos Carousel -->
    <div class="w-full my-40">
      <div class="logos-scroll">
        <div class="logos-track">
          <div class="logo-item w-60 h-16 bg-black"></div>
          <div class="logo-item w-16 h-16 bg-zinc-900"></div>
          <div class="logo-item w-36 h-16 bg-zinc-900"></div>
          <img class="logo-item w-56 h-16" src="https://placehold.co/227x62" alt="Logo" />
          <div class="logo-item w-28 h-16 bg-zinc-900"></div>
          <div class="logo-item w-72 h-16 bg-black"></div>
          <img class="logo-item w-72 h-16" src="https://placehold.co/299x62" alt="Logo" />
          <div class="logo-item w-52 h-16 bg-zinc-900"></div>
          <!-- Duplicate -->
          <div class="logo-item w-60 h-16 bg-black"></div>
          <div class="logo-item w-16 h-16 bg-zinc-900"></div>
          <div class="logo-item w-36 h-16 bg-zinc-900"></div>
          <img class="logo-item w-56 h-16" src="https://placehold.co/227x62" alt="Logo" />
          <div class="logo-item w-28 h-16 bg-zinc-900"></div>
          <div class="logo-item w-72 h-16 bg-black"></div>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-20 relative z-10">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div 
            v-for="testimonial in testimonials" 
            :key="testimonial.name"
            class="animate-testimonial bg-white rounded-[20px] p-6 h-72 flex flex-col"
          >
            <p class="text-zinc-900 text-xl font-light font-['Manrope'] leading-8 mb-auto">
              {{ testimonial.quote }}
            </p>
            <div class="mt-auto">
              <div class="text-zinc-900 text-lg font-medium font-['Manrope'] leading-6">{{ testimonial.name }}</div>
              <div class="text-zinc-400 text-base font-medium font-['Manrope'] leading-6">{{ testimonial.role }}</div>
            </div>
          </div>
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
