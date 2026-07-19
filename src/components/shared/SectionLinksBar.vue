<script setup>
defineProps({
  variant: {
    type: String,
    default: 'dark' // 'dark' or 'light'
  }
})
</script>

<template>
  <!-- Hidden on mobile -->
  <div 
    class="hidden md:block absolute bottom-0 left-0 right-0 w-full py-3 border-t"
    :class="variant === 'dark' ? 'bg-zinc-900 border-gray-800/50' : 'bg-stone-50 border-gray-200/50'"
  >
    <div class="container mx-auto px-6 flex flex-wrap justify-center md:justify-between items-center gap-4 opacity-40">
      <router-link 
        to="/" 
        class="text-sm font-light font-['Manrope'] hover:opacity-100 transition-opacity"
        :class="variant === 'dark' ? 'text-stone-50' : 'text-zinc-900'"
      >
        OSPA
      </router-link>
      <router-link 
        to="/ospa-place" 
        class="text-sm font-light font-['Manrope'] hover:opacity-100 transition-opacity"
        :class="variant === 'dark' ? 'text-stone-50' : 'text-zinc-900'"
      >
        OSPA place
      </router-link>
      <router-link 
        to="/ospa-architecture" 
        class="text-sm font-light font-['Manrope'] hover:opacity-100 transition-opacity"
        :class="variant === 'dark' ? 'text-stone-50' : 'text-zinc-900'"
      >
        OSPA architecture
      </router-link>
      <router-link 
        to="/ospa-capital" 
        class="text-sm font-light font-['Manrope'] hover:opacity-100 transition-opacity"
        :class="variant === 'dark' ? 'text-stone-50' : 'text-zinc-900'"
      >
        OSPA capital
      </router-link>
      <a 
        href="https://www.responsivecities.com/" 
        target="_blank" 
        rel="noopener noreferrer"
        class="text-sm font-light font-['Manrope'] hover:opacity-100 transition-opacity"
        :class="variant === 'dark' ? 'text-stone-50' : 'text-zinc-900'"
      >
        Instituto Cidades Responsivas
      </a>
    </div>
  </div>
</template>
