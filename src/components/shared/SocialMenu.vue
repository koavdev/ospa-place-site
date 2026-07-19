<script setup>
import { ref } from 'vue'

defineProps({
  variant: {
    type: String,
    default: 'dark' // 'dark' or 'light'
  },
  direction: {
    type: String,
    default: 'down' // 'down' or 'up'
  }
})

const socialLinks = {
  instagram: {
    grupo: 'https://www.instagram.com/ospa.grupo',
    place: 'https://www.instagram.com/ospa.place',
    architecture: 'https://www.instagram.com/ospa.architecture',
    //capital: 'https://www.instagram.com/ospa.capital',
    instituto: 'https://www.instagram.com/responsivecities'
  },
  whatsapp: {
    capital: 'https://wa.me/551151948958',
    place: 'https://wa.me/555195414013'
  },
  linkedin: {
    place: 'https://www.linkedin.com/company/ospa-place',
    architecture: 'https://www.linkedin.com/company/ospa-architecture',
    capital: 'https://www.linkedin.com/company/ospa-capital',
    instituto: 'https://www.linkedin.com/school/responsivecities'
  },
  youtube: {
    place: 'https://www.youtube.com/@ospa-place',
    architecture: 'https://www.youtube.com/@ospa.architecture',
    capital: 'https://www.youtube.com/@ospa.capital',
    instituto: 'https://www.youtube.com/@responsivecities'
  }
}

const openMenus = ref({
  instagram: false,
  whatsapp: false,
  linkedin: false,
  youtube: false
})

const toggleMenu = (social) => {
  openMenus.value[social] = !openMenus.value[social]
}

const closeMenu = (social) => {
  openMenus.value[social] = false
}
</script>

<template>
  <div class="flex gap-12">
    <!-- Instagram -->
    <div 
      class="relative"
      @mouseenter="openMenus.instagram = true"
      @mouseleave="closeMenu('instagram')"
    >
      <button 
        @click="toggleMenu('instagram')"
        :class="[
          'text-xl font-light font-[\'Manrope\'] leading-8 transition-colors',
          variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-900 hover:text-zinc-500'
        ]"
      >
        Instagram
      </button>
      
      <div 
        v-show="openMenus.instagram"
        :class="[
          'absolute left-0 w-48 z-10',
          direction === 'up' ? 'bottom-full pb-2' : 'top-full pt-2'
        ]"
      >
        <div :class="[
          'rounded-lg py-3 px-4 shadow-lg',
          variant === 'dark' 
            ? 'bg-zinc-800/95 backdrop-blur-sm' 
            : 'bg-stone-50/95 backdrop-blur-sm'
        ]">
          <a 
            :href="socialLinks.instagram.grupo" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA
          </a>
          <a 
            :href="socialLinks.instagram.place" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA place
          </a>
          <a 
            :href="socialLinks.instagram.architecture" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA architecture
          </a>
          <a 
            :href="socialLinks.instagram.instituto" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            Instituto Cidades Responsivas
          </a>
        </div>
      </div>
    </div>

    <!-- WhatsApp -->
    <div 
      class="relative"
      @mouseenter="openMenus.whatsapp = true"
      @mouseleave="closeMenu('whatsapp')"
    >
      <button 
        @click="toggleMenu('whatsapp')"
        :class="[
          'text-xl font-light font-[\'Manrope\'] leading-8 transition-colors',
          variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-900 hover:text-zinc-500'
        ]"
      >
        WhatsApp
      </button>
      
      <div 
        v-show="openMenus.whatsapp"
        :class="[
          'absolute left-0 w-48 z-10',
          direction === 'up' ? 'bottom-full pb-2' : 'top-full pt-2'
        ]"
      >
        <div :class="[
          'rounded-lg py-3 px-4 shadow-lg',
          variant === 'dark' 
            ? 'bg-zinc-800/95 backdrop-blur-sm' 
            : 'bg-stone-50/95 backdrop-blur-sm'
        ]">
          <a 
            :href="socialLinks.whatsapp.capital" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA capital
          </a>
          <a 
            :href="socialLinks.whatsapp.place" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA place
          </a>
        </div>
      </div>
    </div>

    <!-- LinkedIn -->
    <div 
      class="relative"
      @mouseenter="openMenus.linkedin = true"
      @mouseleave="closeMenu('linkedin')"
    >
      <button 
        @click="toggleMenu('linkedin')"
        :class="[
          'text-xl font-light font-[\'Manrope\'] leading-8 transition-colors',
          variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-900 hover:text-zinc-500'
        ]"
      >
        LinkedIn
      </button>
      
      <div 
        v-show="openMenus.linkedin"
        :class="[
          'absolute left-0 w-48 z-10',
          direction === 'up' ? 'bottom-full pb-2' : 'top-full pt-2'
        ]"
      >
        <div :class="[
          'rounded-lg py-3 px-4 shadow-lg',
          variant === 'dark' 
            ? 'bg-zinc-800/95 backdrop-blur-sm' 
            : 'bg-stone-50/95 backdrop-blur-sm'
        ]">
          <a 
            :href="socialLinks.linkedin.place" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA place
          </a>
          <a 
            :href="socialLinks.linkedin.architecture" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA architecture
          </a>
          <a 
            :href="socialLinks.linkedin.capital" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA capital
          </a>
          <a 
            :href="socialLinks.linkedin.instituto" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            Instituto Cidades Responsivas
          </a>
        </div>
      </div>
    </div>

    <!-- Youtube -->
    <div 
      class="relative"
      @mouseenter="openMenus.youtube = true"
      @mouseleave="closeMenu('youtube')"
    >
      <button 
        @click="toggleMenu('youtube')"
        :class="[
          'text-xl font-light font-[\'Manrope\'] leading-8 transition-colors',
          variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-900 hover:text-zinc-500'
        ]"
      >
        Youtube
      </button>
      
      <div 
        v-show="openMenus.youtube"
        :class="[
          'absolute left-0 w-48 z-10',
          direction === 'up' ? 'bottom-full pb-2' : 'top-full pt-2'
        ]"
      >
        <div :class="[
          'rounded-lg py-3 px-4 shadow-lg',
          variant === 'dark' 
            ? 'bg-zinc-800/95 backdrop-blur-sm' 
            : 'bg-stone-50/95 backdrop-blur-sm'
        ]">
          <a 
            :href="socialLinks.youtube.place" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA place
          </a>
          <a 
            :href="socialLinks.youtube.architecture" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA architecture
          </a>
          <a 
            :href="socialLinks.youtube.capital" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            OSPA capital
          </a>
          <a 
            :href="socialLinks.youtube.instituto" 
            target="_blank" 
            rel="noopener noreferrer"
            :class="[
              'block py-1.5 text-sm font-light font-[\'Manrope\'] transition-colors',
              variant === 'dark' ? 'text-stone-50 hover:text-zinc-400' : 'text-zinc-800 hover:text-zinc-500'
            ]"
          >
            Instituto Cidades Responsivas
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
