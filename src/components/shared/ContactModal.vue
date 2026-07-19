<script setup>
import { ref, watch, onUnmounted, computed, nextTick } from 'vue'
import SocialMenu from './SocialMenu.vue'
import { useFormSubmission } from '@/composables/useFormSubmission.js'
import { usePhoneMaskComputed } from '@/composables/usePhoneMask.js'
import { setoresAtuacao, cargos } from '@/utils/formOptions.js'
import { useChoices } from '@/composables/useChoices.js'

const props = defineProps({
  isOpen: Boolean
})

const emit = defineEmits(['close'])

const { loading, error, success, submitForm, reset } = useFormSubmission()
const { initChoices, destroyInstance } = useChoices()

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  empresa: '',
  setorAtuacao: '',
  cargo: '',
  message: ''
})

const formErrors = ref({})

// Refs para os elementos select
const setorAtuacaoSelectRef = ref(null)
const cargoSelectRef = ref(null)

// Instâncias do Choices.js
const setorAtuacaoChoices = ref(null)
const cargoChoices = ref(null)

// Preparar opções para Choices.js
const setoresChoices = setoresAtuacao.map(s => ({ value: s, label: s }))
const cargosChoices = cargos.map(c => ({ value: c, label: c }))

// Computed para telefone com máscara
const phoneValue = computed(usePhoneMaskComputed(formData))

// Inicializar Choices.js quando o modal abrir
const initChoicesInstances = async () => {
  await nextTick()
  
  // Setor de Atuação
  if (setorAtuacaoSelectRef.value) {
    setorAtuacaoChoices.value = await initChoices(setorAtuacaoSelectRef.value, {
      placeholderValue: 'Selecione o setor',
      choices: setoresChoices
    })
    const setorElement = setorAtuacaoChoices.value.passedElement.element
    setorElement.addEventListener('change', (e) => {
      formData.value.setorAtuacao = e.target.value
    })
  }

  // Cargo
  if (cargoSelectRef.value) {
    cargoChoices.value = await initChoices(cargoSelectRef.value, {
      placeholderValue: 'Selecione o cargo',
      choices: cargosChoices
    })
    const cargoElement = cargoChoices.value.passedElement.element
    cargoElement.addEventListener('change', (e) => {
      formData.value.cargo = e.target.value
    })
  }
}

// Destruir instâncias do Choices.js
const destroyChoicesInstances = () => {
  if (setorAtuacaoSelectRef.value) destroyInstance(setorAtuacaoSelectRef.value)
  if (cargoSelectRef.value) destroyInstance(cargoSelectRef.value)
  
  setorAtuacaoChoices.value = null
  cargoChoices.value = null
}

const resetFormData = () => {
  return {
    name: '',
    email: '',
    phone: '',
    empresa: '',
    setorAtuacao: '',
    cargo: '',
    message: ''
  }
}

const handleClose = () => {
  reset()
  formData.value = resetFormData()
  formErrors.value = {}
  destroyChoicesInstances()
  emit('close')
}

const handleBackdropClick = (e) => {
  if (e.target === e.currentTarget) {
    handleClose()
  }
}

const validateForm = () => {
  formErrors.value = {}
  let isValid = true

  if (!formData.value.name || formData.value.name.trim() === '') {
    formErrors.value.name = 'Nome é obrigatório'
    isValid = false
  }

  if (!formData.value.email || formData.value.email.trim() === '') {
    formErrors.value.email = 'Email é obrigatório'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.email)) {
    formErrors.value.email = 'Email inválido'
    isValid = false
  }

  if (!formData.value.empresa || formData.value.empresa.trim() === '') {
    formErrors.value.empresa = 'Empresa é obrigatória'
    isValid = false
  }

  if (!formData.value.setorAtuacao) {
    formErrors.value.setorAtuacao = 'Setor de atuação é obrigatório'
    isValid = false
  }

  if (!formData.value.cargo) {
    formErrors.value.cargo = 'Cargo é obrigatório'
    isValid = false
  }

  return isValid
}

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  try {
    // Remove máscara do telefone antes de enviar (apenas números)
    const phoneClean = formData.value.phone ? formData.value.phone.replace(/\D/g, '') : null
    
    await submitForm(
      'crp-home-ospa-entre-em-contato-de5fb00db14c0891d545',
      'contact',
      null,
      {
        name: formData.value.name.trim(),
        email: formData.value.email.trim(),
        phone: phoneClean || null,
        empresa: formData.value.empresa.trim(),
        setorAtuacao: formData.value.setorAtuacao,
        cargo: formData.value.cargo,
        message: formData.value.message.trim() || null
      }
    )

    // Success - reset form after a short delay
    setTimeout(() => {
      formData.value = resetFormData()
      formErrors.value = {}
      reset()
      destroyChoicesInstances()
    }, 3000)
  } catch (err) {
    // Error is handled by the composable
    console.error('Form submission error:', err)
  }
}

watch(() => props.isOpen, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    document.body.style.overflow = 'hidden'
    reset()
    await nextTick()
    setTimeout(() => {
      initChoicesInstances()
    }, 100)
  } else if (!newVal) {
    document.body.style.overflow = ''
    destroyChoicesInstances()
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
  destroyChoicesInstances()
})

const currentYear = new Date().getFullYear()
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div 
        v-if="isOpen" 
        class="fixed inset-0 z-[100] bg-zinc-900 overflow-y-auto"
        @click="handleBackdropClick"
        @keydown.escape="handleClose"
      >
        <div class="min-h-screen w-full">
          <!-- Close Button -->
          <button 
            class="fixed top-6 right-6 md:top-8 md:right-8 text-stone-50 hover:text-zinc-400 transition-colors z-10 p-2"
            @click="handleClose"
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <div class="container mx-auto px-6 py-20 md:py-28">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              
              <!-- Left Side - Info -->
              <div class="flex flex-col gap-8">
                <div>
                  <img src="/logos/ospa-white.svg" alt="OSPA Logo" class="h-16 w-auto mb-12">
                </div>
                
                <p class="text-zinc-400 text-lg font-light font-['Manrope'] leading-6 max-w-md text-justify">
                  Com foco em inteligência territorial, projeto e capital, atua no desenvolvimento urbano da análise do território à estruturação do ativo imobiliário, em parceria com governos, investidores e desenvolvedores.
                </p>

                <p class="text-stone-50 text-lg font-light font-['Manrope'] leading-6 mt-8">
                  Porto Alegre, São Paulo e Miami
                </p>

                <!-- Logos -->
                <div class="flex gap-11 mt-auto pt-20">
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
              </div>

              <!-- Right Side - Custom Form -->
              <div class="flex flex-col gap-6">
                <h2 class="text-stone-50 text-2xl md:text-3xl font-light font-['Manrope'] mb-4">
                  Entre em contato
                </h2>

                <!-- Success Message -->
                <div 
                  v-if="success" 
                  class="bg-green-900/30 border border-green-700 text-green-50 px-4 py-3 rounded mb-4"
                >
                  <p class="text-sm font-light font-['Manrope']">
                    Mensagem enviada com sucesso! Entraremos em contato em breve.
                  </p>
                </div>

                <!-- Error Message -->
                <div 
                  v-if="error" 
                  class="bg-red-900/30 border border-red-700 text-red-50 px-4 py-3 rounded mb-4"
                >
                  <p class="text-sm font-light font-['Manrope']">
                    {{ error }}
                  </p>
                </div>

                <!-- Form -->
                <form @submit="handleSubmit" class="space-y-4">
                  <!-- Row 1: Nome e Email -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Name Field -->
                    <div>
                      <label for="name" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Nome *
                      </label>
                      <input
                        id="name"
                        v-model="formData.name"
                        type="text"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                        placeholder="Seu nome"
                      />
                      <p v-if="formErrors.name" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.name }}
                      </p>
                    </div>

                    <!-- Email Field -->
                    <div>
                      <label for="email" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Email *
                      </label>
                      <input
                        id="email"
                        v-model="formData.email"
                        type="email"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                        placeholder="seu@email.com"
                      />
                      <p v-if="formErrors.email" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.email }}
                      </p>
                    </div>
                  </div>

                  <!-- Row 2: Telefone e Setor de Atuação -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Phone Field -->
                    <div>
                      <label for="phone" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Telefone
                      </label>
                      <input
                        id="phone"
                        v-model="phoneValue"
                        type="tel"
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                        placeholder="(00) 00000-0000"
                      />
                    </div>

                    <!-- Setor de Atuação Field -->
                    <div>
                      <label for="setorAtuacao" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Setor de atuação *
                      </label>
                      <select
                        ref="setorAtuacaoSelectRef"
                        id="setorAtuacao"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                      >
                        <option value="">Selecione o setor</option>
                      </select>
                      <p v-if="formErrors.setorAtuacao" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.setorAtuacao }}
                      </p>
                    </div>
                  </div>

                  <!-- Row 3: Empresa e Cargo -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Empresa Field -->
                    <div>
                      <label for="empresa" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Empresa *
                      </label>
                      <input
                        id="empresa"
                        v-model="formData.empresa"
                        type="text"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                        placeholder="Nome da empresa"
                      />
                      <p v-if="formErrors.empresa" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.empresa }}
                      </p>
                    </div>

                    <!-- Cargo Field -->
                    <div>
                      <label for="cargo" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Cargo *
                      </label>
                      <select
                        ref="cargoSelectRef"
                        id="cargo"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                      >
                        <option value="">Selecione o cargo</option>
                      </select>
                      <p v-if="formErrors.cargo" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.cargo }}
                      </p>
                    </div>
                  </div>

                  <!-- Message Field -->
                  <div>
                    <label for="message" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                      Mensagem
                    </label>
                    <textarea
                      id="message"
                      v-model="formData.message"
                      rows="4"
                      :disabled="loading"
                      class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50 resize-none"
                      placeholder="Sua mensagem"
                    ></textarea>
                  </div>

                  <!-- Submit Button -->
                  <button
                    type="submit"
                    :disabled="loading"
                    class="w-full bg-transparent border border-zinc-600 rounded-full px-6 py-3 text-zinc-400 font-light font-['Manrope'] hover:bg-zinc-600 hover:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span v-if="loading">Enviando...</span>
                    <span v-else>Enviar</span>
                  </button>
                </form>

                <!-- Social Links -->
                <div class="mt-8">
                  <SocialMenu variant="dark" />
                </div>

                <!-- Contact Info -->
                <div class="mt-8">
                  <p class="text-zinc-400 text-base font-light font-['Manrope'] leading-3 mb-2 uppercase">CONTATO</p>
                  <a href="mailto:contato@ospa.com.br" class="text-stone-50 text-lg font-light font-['Manrope'] underline leading-6 hover:text-zinc-300 transition-colors">contato@ospa.com.br</a>
                </div>

                <!-- Copyright -->
                <p class="text-zinc-400 text-sm font-light font-['Manrope'] leading-6 mt-auto pt-8">
                  Copyright @ {{ currentYear }} OSPA. All rights reserved.
                </p>
              </div>
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
