<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import SocialMenu from './SocialMenu.vue'

const emit = defineEmits(['openPrivacyModal'])
const route = useRoute()

const currentYear = new Date().getFullYear()
const isMobile = ref(false)

// Verifica se está em uma rota do Capital
const isCapitalRoute = computed(() => {
  return route.path.startsWith('/capital') || route.path.startsWith('/ospa-capital')
})

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>

<template>
  <footer id="contato" data-header-style="hidden" class="h-screen w-full relative overflow-hidden bg-zinc-900">
    
    <!-- Mobile Layout -->
    <div v-if="isMobile" class="h-full flex flex-col px-6 py-12 overflow-y-auto">
      <!-- Logo -->
      <div class="mb-6">
        <router-link to="/" class="cursor-pointer hover:opacity-80 transition-opacity">
          <img src="/logos/ospa-white.svg" alt="OSPA Logo" class="h-12 w-auto">
        </router-link>
      </div>

      <!-- Description -->
      <p class="text-zinc-400 text-base font-light font-['Manrope'] leading-6 mb-6">
        Com foco em inteligência territorial, projeto e capital atua o desenvolvimento urbano que vai da análise do território à estruturação do ativo imobiliário, em parceria com governos, investidores e desenvolvedores.
      </p>

      <!-- Location -->
      <p class="text-stone-50 text-base font-light font-['Manrope'] leading-6 mb-6">
        Porto Alegre, São Paulo e Miami
      </p>

      <!-- Verticals logos -->
      <div class="flex flex-wrap gap-6 mb-8">
        <a href="/ospa-place" class="group">
          <img src="/logos/place-white.svg" class="h-8 w-auto" alt="OSPA place" />
        </a>
        <a href="/ospa-architecture" class="group">
          <img src="/logos/arq-white.svg" class="h-8 w-auto" alt="OSPA arq" />
        </a>
        <a href="/ospa-capital" class="group">
          <img src="/logos/capital-white.svg" class="h-8 w-auto" alt="OSPA capital" />
        </a>
        <a href="https://www.responsivecities.com/" class="group">
          <img src="/logos/responsivecities-white.svg" class="h-8 w-auto" alt="Instituto" />
        </a>
      </div>

      <!-- WSFRC Logo -->
      <div class="mb-6">
        <img src="/logos/wsfrc-white.svg" class="h-10 w-auto" alt="WSFRC" />
      </div>

      <!-- Social -->
      <div class="mb-6">
        <SocialMenu variant="dark" direction="up" />
      </div>

      <!-- Contact -->
      <div class="mb-4">
        <p class="text-zinc-400 text-sm font-light font-['Manrope'] mb-1 uppercase">CONTATO</p>
        <a href="mailto:contato@ospa.com.br" class="text-stone-50 text-base font-light font-['Manrope'] underline hover:text-zinc-300 transition-colors">contato@ospa.com.br</a>
      </div>

      <!-- CNPJ -->
      <div class="mb-6">
        <p class="text-zinc-400 text-sm font-light font-['Manrope'] mb-1 uppercase">CNPJ</p>
        <p class="text-stone-50 text-base font-light font-['Manrope']">07.616.245/0001-97</p>
      </div>

      <!-- Links -->
      <div class="flex flex-col gap-2 mb-6">
        <a href="https://airtable.com/appjfZd7iWRgXnjVp/shrwmzKfQnRQaPk7L" class="text-zinc-400 text-sm font-light font-['Manrope'] hover:text-stone-50 transition-colors">Trabalhe Conosco</a>
        <button
          @click="emit('openPrivacyModal')"
          class="text-zinc-400 text-sm font-light font-['Manrope'] hover:text-stone-50 transition-colors text-left"
        >
          Aviso de Privacidade
        </button>
        <router-link 
          v-if="isCapitalRoute"
          to="/capital/termos-de-uso"
          class="text-zinc-400 text-sm font-light font-['Manrope'] hover:text-stone-50 transition-colors"
        >
          Termos de Uso
        </router-link>
      </div>

      <!-- Copyright -->
      <div class="mt-auto pt-4 border-t border-zinc-800">
        <p class="text-zinc-400 text-xs font-light font-['Manrope']">
          Copyright @ {{ currentYear }} OSPA. All rights reserved.
        </p>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div v-else class="container mx-auto px-6 h-full flex flex-col py-20 justify-between">
      
      <!-- Row 1: Logos -->
      <div class="grid grid-cols-2 justify-between items-start mb-12">
        <div class="col-span-1 gap-8">
          <router-link to="/" class="cursor-pointer hover:opacity-80 transition-opacity">
            <img src="/logos/ospa-white.svg" alt="OSPA Logo" class="h-16 w-auto">
          </router-link>
        </div>
        <div class="col-span-1 gap-8">
          <img src="/logos/wsfrc-white.svg" class="h-16 w-auto" alt="WSFRC" />
        </div>
      </div>

      <!-- Row 2: Description -->
      <div class="grid grid-cols-2 gap-8 mb-12">
        <div class="col-span-1">
          <p class="text-zinc-400 text-lg font-light font-['Manrope'] max-w-[80%] leading-6 text-justify">
            Com foco em inteligência territorial, projeto e capital atua o desenvolvimento urbano que vai da análise do território à estruturação do ativo imobiliário, em parceria com governos, investidores e desenvolvedores.
          </p>
        </div>
        <div class="col-span-1">
          <!-- Empty column for 50% layout -->
        </div>
      </div>

      <!-- Row 3: Cities + Social/Contact -->
      <div class="grid grid-cols-2 gap-8 mb-12">
        <!-- Left: Cities -->
        <div class="col-span-1">
          <p class="text-stone-50 text-lg font-light font-['Manrope'] leading-6">
            Porto Alegre, São Paulo e Miami
          </p>
        </div>
        
        <!-- Right: Social + Contact + CNPJ + Links -->
        <div class="col-span-1 flex flex-col gap-8">
          <div>
            <SocialMenu variant="dark" direction="up" />
          </div>
          <div>
            <p class="text-zinc-400 text-base font-light font-['Manrope'] leading-3 mb-2 uppercase">CONTATO</p>
            <a href="mailto:contato@ospa.com.br" class="text-stone-50 text-lg font-light font-['Manrope'] underline leading-6 hover:text-zinc-300 transition-colors">contato@ospa.com.br</a>
          </div>
          <div>
            <p class="text-zinc-400 text-base font-light font-['Manrope'] leading-3 mb-2 uppercase">CNPJ</p>
            <p class="text-stone-50 text-lg font-light font-['Manrope'] leading-6">07.616.245/0001-97</p>
          </div>
          <div class="flex flex-col gap-2">
            <a href="https://airtable.com/appjfZd7iWRgXnjVp/shrwmzKfQnRQaPk7L" class="text-zinc-400 text-sm font-light font-['Manrope'] leading-6 hover:text-stone-50 transition-colors">Trabalhe Conosco</a>
            <button 
              @click="emit('openPrivacyModal')"
              class="text-zinc-400 text-sm font-light font-['Manrope'] leading-6 hover:text-stone-50 transition-colors text-left"
            >
              Aviso de Privacidade
            </button>
            <router-link 
              v-if="isCapitalRoute"
              to="/capital/termos-de-uso"
              class="text-zinc-400 text-sm font-light font-['Manrope'] leading-6 hover:text-stone-50 transition-colors"
            >
              Termos de Uso
            </router-link>
          </div>
        </div>
      </div>

      <!-- Row 4: Vertical Logos + Copyright -->
      <div class="grid grid-cols-2 justify-between items-start mb-12">
        <!-- Left: Vertical Logos -->
        <div class="col-span-1 flex gap-11">
          <a href="/ospa-place" class="group">
            <img src="/logos/place-white.svg" class="h-12 w-auto" alt="OSPA place" />
          </a>
          <a href="/ospa-architecture" class="group">
            <img src="/logos/arq-white.svg" class="h-12 w-auto" alt="OSPA arq" />
          </a>
          <a href="/ospa-capital" class="group">
            <img src="/logos/capital-white.svg" class="h-12 w-auto" alt="OSPA capital" />
          </a>
          <a href="https://www.responsivecities.com/" class="group">
            <img src="/logos/responsivecities-white.svg" class="h-12 w-auto" alt="Instituto" />
          </a>
        </div>
        
        <!-- Right: Copyright -->
        <div class="col-span-1 flex flex-col gap-8">
          <p class="text-zinc-400 text-sm font-light font-['Manrope'] leading-6">
            Copyright @ {{ currentYear }} OSPA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
