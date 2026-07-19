<script setup>
import { watch } from 'vue'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close', 'selectUserType'])

const handleClose = () => {
  emit('close')
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

const selectUserType = (type) => {
  emit('selectUserType', type)
}

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] bg-zinc-900/95 backdrop-blur-sm flex items-center justify-center p-6"
        @click="handleBackdropClick"
        @keydown.escape="handleClose"
      >
        <div class="relative bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full p-8 md:p-12">
          <!-- Close Button -->
          <button 
            class="absolute top-6 right-6 text-stone-50 hover:text-zinc-400 transition-colors p-2"
            @click="handleClose"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Content -->
          <div class="flex flex-col items-center text-center gap-8">
            <img src="/logos/place-white.svg" alt="OSPA place" class="h-16 w-auto">
            
            <div>
              <h2 class="text-stone-50 text-3xl md:text-4xl font-light font-['Manrope'] mb-4">
                Agende uma Demo
              </h2>
              <p class="text-zinc-400 text-lg font-light font-['Manrope']">
                Para continuar, selecione seu perfil:
              </p>
            </div>

            <!-- User Type Buttons -->
            <div class="flex flex-col sm:flex-row gap-4 w-full mt-4">
              <button
                @click="selectUserType('governo')"
                class="flex-1 py-6 px-8 rounded-xl border-2 border-neutral-500 text-neutral-500 text-xl font-light font-['Manrope'] hover:bg-neutral-500 hover:text-zinc-900 transition-all duration-300 hover:scale-105 uppercase"
              >
                Sou Governo
              </button>
              
              <button
                @click="selectUserType('mercado')"
                class="flex-1 py-6 px-8 rounded-xl border-2 border-neutral-500 text-neutral-500 text-xl font-light font-['Manrope'] hover:bg-neutral-500 hover:text-zinc-900 transition-all duration-300 hover:scale-105 uppercase"
              >
                Sou Mercado
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
