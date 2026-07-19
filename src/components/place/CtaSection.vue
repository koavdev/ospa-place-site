<script setup>
import { onMounted, onUnmounted, ref, nextTick } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SectionLinksBar from '../shared/SectionLinksBar.vue'

typeof gsap.registerPlugin === 'function' && gsap.registerPlugin(ScrollTrigger)

const emit = defineEmits(['openDemo'])

const sectionRef = ref(null)
let ctx = null

onMounted(() => {
  nextTick(() => {
    setTimeout(() => {
      if (!sectionRef.value) return
      
      const elements = sectionRef.value.querySelectorAll('.animate-cta')
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
          duration: 0.8,
          stagger: 0.2
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
  <section ref="sectionRef" id="cta" data-header-style="default" class="min-h-screen w-full relative flex items-center">
    <div class="container mx-auto px-6 py-20 relative z-10 w-full">
      <div class="max-w-4xl">
        <div class="mb-12">
          <h2 class="animate-cta text-zinc-900 text-3xl md:text-5xl font-medium font-['Manrope'] leading-tight mb-8">
            Quantas decisões importantes ainda serão tomadas com dados dispersos e desconectados?
          </h2>

          <p class="animate-cta text-neutral-500 text-xl font-light font-['Manrope'] leading-7 mb-12 max-w-xl">
            Sem interoperabilidade, atrasos e riscos se intensificam. Simplifique sua gestão com inteligência territorial.
          </p>

          <div class="animate-cta flex flex-col sm:flex-row gap-4">
            <button 
              @click="emit('openDemo')"
              class="w-full sm:w-60 h-9 rounded-[20px] border-[0.50px] border-neutral-500 flex items-center justify-center hover:bg-neutral-500 hover:text-white transition-colors group cursor-pointer uppercase"
            >
              <span class="text-neutral-500 text-base font-light font-['Manrope'] leading-8 group-hover:text-white transition-colors uppercase">agendar</span>
            </button>
            <a 
              href="#market"
              class="w-full sm:w-60 h-9 rounded-[20px] border-[0.50px] border-neutral-500 flex items-center justify-center hover:bg-neutral-500 hover:text-white transition-colors group cursor-pointer uppercase"
            >
              <span class="text-neutral-500 text-base font-light font-['Manrope'] leading-8 group-hover:text-white transition-colors uppercase">conhecer soluções</span>
            </a>
          </div>
        </div>
      </div>
    </div>
    <SectionLinksBar variant="light" />
  </section>
</template>
