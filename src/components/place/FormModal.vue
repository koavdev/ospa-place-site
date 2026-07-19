<script setup>
import { ref, watch, onUnmounted, computed, nextTick } from 'vue'
import SocialMenu from '../shared/SocialMenu.vue'
import { useFormSubmission } from '@/composables/useFormSubmission.js'
import { estados, cidadesPorEstado, setoresAtuacao, cargos, cargosGoverno, revisaoPlanoDiretor, getCidadesByEstado, getNomeEstado } from '@/utils/formOptions.js'
import { usePhoneMaskComputed } from '@/composables/usePhoneMask.js'
import { useChoices } from '@/composables/useChoices.js'

const props = defineProps({
  isOpen: Boolean,
  userType: String // 'governo' or 'mercado'
})

const emit = defineEmits(['close', 'back'])

const { loading, error, success, submitForm, reset } = useFormSubmission()

const formConfigs = {
  governo: {
    id: 'plc-site-agendar-uma-demo-governo-262febc7d3d594d62b33',
    title: 'Agende uma Demo'
  },
  mercado: {
    id: 'plc-site-agendar-uma-demo-mercado-6f1ac4c953996f65a76a',
    title: 'Agende uma Demo'
  }
}

const getFormConfig = () => {
  return formConfigs[props.userType] || {}
}

// Form data
const formData = ref({
  name: '',
  email: '',
  phone: '',
  setorAtuacao: '',
  empresa: '',
  cargo: '',
  estado: '',
  cidade: '',
  message: '',
  // Campos específicos para governo
  orgaoPublico: '',
  secretaria: '',
  revisaoPlanoDiretor: ''
})

const formErrors = ref({})

// Refs para os elementos select
const setorAtuacaoSelectRef = ref(null)
const cargoSelectRef = ref(null)
const estadoSelectRef = ref(null)
const cidadeSelectRef = ref(null)
const revisaoPlanoDiretorSelectRef = ref(null)

// Instâncias do Choices.js
const setorAtuacaoChoices = ref(null)
const cargoChoices = ref(null)
const estadoChoices = ref(null)
const cidadeChoices = ref(null)
const revisaoPlanoDiretorChoices = ref(null)

// Cidades disponíveis baseadas no estado selecionado
const cidadesDisponiveis = computed(() => {
  if (!formData.value.estado) return []
  return getCidadesByEstado(formData.value.estado)
})

// Choices composable
const { initChoices, updateChoices, setValue, clearValue, destroyInstance } = useChoices()

// Preparar opções para Choices.js
const setoresChoices = setoresAtuacao.map(s => ({ value: s, label: s }))
const cargosChoices = cargos.map(c => ({ value: c, label: c }))
const cargosGovernoChoices = cargosGoverno.map(c => ({ value: c, label: c }))
const estadosChoices = estados.map(e => ({ value: e, label: e }))
const revisaoPlanoDiretorChoices_options = revisaoPlanoDiretor.map(r => ({ value: r, label: r }))

// Computed para verificar se é governo
const isGoverno = computed(() => props.userType === 'governo')

// Inicializar Choices.js quando o modal abrir
const initChoicesInstances = async () => {
  await nextTick()
  
  // Setor de Atuação (apenas para mercado)
  if (!isGoverno.value && setorAtuacaoSelectRef.value) {
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
    const cargoOptions = isGoverno.value ? cargosGovernoChoices : cargosChoices
    cargoChoices.value = await initChoices(cargoSelectRef.value, {
      placeholderValue: 'Selecione o cargo',
      choices: cargoOptions
    })
    const cargoElement = cargoChoices.value.passedElement.element
    cargoElement.addEventListener('change', (e) => {
      formData.value.cargo = e.target.value
    })
  }

  // Estado
  if (estadoSelectRef.value) {
    estadoChoices.value = await initChoices(estadoSelectRef.value, {
      placeholderValue: 'Selecione o estado',
      choices: estadosChoices
    })
    const estadoElement = estadoChoices.value.passedElement.element
    estadoElement.addEventListener('change', (e) => {
      formData.value.estado = e.target.value
      formData.value.cidade = '' // Reset cidade
    })
  }

  // Cidade
  if (cidadeSelectRef.value) {
    cidadeChoices.value = await initChoices(cidadeSelectRef.value, {
      placeholderValue: 'Selecione primeiro o estado',
      choices: [],
      searchEnabled: true
    })
    const cidadeElement = cidadeChoices.value.passedElement.element
    cidadeElement.addEventListener('change', (e) => {
      formData.value.cidade = e.target.value
    })
  }

  // Revisão do Plano Diretor (apenas para governo)
  if (isGoverno.value && revisaoPlanoDiretorSelectRef.value) {
    revisaoPlanoDiretorChoices.value = await initChoices(revisaoPlanoDiretorSelectRef.value, {
      placeholderValue: 'Selecione uma opção',
      choices: revisaoPlanoDiretorChoices_options
    })
    const revisaoElement = revisaoPlanoDiretorChoices.value.passedElement.element
    revisaoElement.addEventListener('change', (e) => {
      formData.value.revisaoPlanoDiretor = e.target.value
    })
  }
}

// Destruir instâncias do Choices.js
const destroyChoicesInstances = () => {
  if (setorAtuacaoSelectRef.value) destroyInstance(setorAtuacaoSelectRef.value)
  if (cargoSelectRef.value) destroyInstance(cargoSelectRef.value)
  if (estadoSelectRef.value) destroyInstance(estadoSelectRef.value)
  if (cidadeSelectRef.value) destroyInstance(cidadeSelectRef.value)
  if (revisaoPlanoDiretorSelectRef.value) destroyInstance(revisaoPlanoDiretorSelectRef.value)
  
  setorAtuacaoChoices.value = null
  cargoChoices.value = null
  estadoChoices.value = null
  cidadeChoices.value = null
  revisaoPlanoDiretorChoices.value = null
}

// Computed para telefone com máscara
const phoneValue = computed(usePhoneMaskComputed(formData))

// Atualizar cidades quando estado mudar
watch(() => formData.value.estado, async (newEstado, oldEstado) => {
  console.log('Estado changed:', oldEstado, '->', newEstado)
  formData.value.cidade = ''
  
  if (cidadeChoices.value && newEstado) {
    const cidades = getCidadesByEstado(newEstado)
    console.log('Cidades encontradas:', cidades.length)
    const cidadesOpcoes = cidades.map(c => ({ value: c, label: c }))
    
    // Habilitar o Choices.js
    cidadeChoices.value.enable()
    
    // Atualizar placeholder antes de setar as choices
    cidadeChoices.value.config.placeholderValue = 'Selecione a cidade'
    updateChoices(cidadeChoices.value, cidadesOpcoes)
  } else if (cidadeChoices.value) {
    // Desabilitar quando não tem estado
    cidadeChoices.value.disable()
    cidadeChoices.value.config.placeholderValue = 'Selecione primeiro o estado'
    updateChoices(cidadeChoices.value, [])
  }
})

const resetFormData = () => {
  return {
    name: '',
    email: '',
    phone: '',
    setorAtuacao: '',
    empresa: '',
    cargo: '',
    estado: '',
    cidade: '',
    message: '',
    orgaoPublico: '',
    secretaria: '',
    revisaoPlanoDiretor: ''
  }
}

const handleClose = () => {
  reset()
  formData.value = resetFormData()
  formErrors.value = {}
  destroyChoicesInstances()
  emit('close')
}

const handleBack = () => {
  reset()
  formData.value = resetFormData()
  formErrors.value = {}
  destroyChoicesInstances()
  emit('back')
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

  // Validações específicas para mercado
  if (!isGoverno.value) {
    if (!formData.value.setorAtuacao) {
      formErrors.value.setorAtuacao = 'Setor de atuação é obrigatório'
      isValid = false
    }

    if (!formData.value.empresa || formData.value.empresa.trim() === '') {
      formErrors.value.empresa = 'Empresa é obrigatória'
      isValid = false
    }
  }

  // Validações específicas para governo
  if (isGoverno.value) {
    if (!formData.value.orgaoPublico || formData.value.orgaoPublico.trim() === '') {
      formErrors.value.orgaoPublico = 'Órgão público é obrigatório'
      isValid = false
    }

    if (!formData.value.secretaria || formData.value.secretaria.trim() === '') {
      formErrors.value.secretaria = 'Secretaria/Departamento é obrigatório'
      isValid = false
    }

    if (!formData.value.revisaoPlanoDiretor) {
      formErrors.value.revisaoPlanoDiretor = 'Data de revisão do Plano Diretor é obrigatória'
      isValid = false
    }
  }

  if (!formData.value.cargo) {
    formErrors.value.cargo = 'Cargo é obrigatório'
    isValid = false
  }

  if (!formData.value.estado) {
    formErrors.value.estado = 'Estado é obrigatório'
    isValid = false
  }

  if (!formData.value.cidade || formData.value.cidade.trim() === '') {
    formErrors.value.cidade = 'Cidade é obrigatória'
    isValid = false
  }

  return isValid
}

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) {
    return
  }

  const config = getFormConfig()
  if (!config.id) return

  try {
    // Remove máscara do telefone antes de enviar (apenas números)
    const phoneClean = formData.value.phone ? formData.value.phone.replace(/\D/g, '') : null
    
    // Dados base
    const submitData = {
      name: formData.value.name.trim(),
      email: formData.value.email.trim(),
      phone: phoneClean || null,
      cargo: formData.value.cargo,
      estado: formData.value.estado,
      cidade: formData.value.cidade.trim(),
      message: formData.value.message.trim() || null
    }

    // Adicionar campos específicos baseado no tipo de usuário
    if (isGoverno.value) {
      submitData.orgaoPublico = formData.value.orgaoPublico.trim()
      submitData.secretaria = formData.value.secretaria.trim()
      submitData.revisaoPlanoDiretor = formData.value.revisaoPlanoDiretor
      submitData.setorAtuacao = 'Governo/Poder Público' // Setor automático para governo
    } else {
      submitData.setorAtuacao = formData.value.setorAtuacao
      submitData.empresa = formData.value.empresa.trim()
    }
    
    await submitForm(
      config.id,
      'demo',
      props.userType,
      submitData
    )

    // Success - reset form after a short delay
    setTimeout(() => {
      formData.value = resetFormData()
      formErrors.value = {}
      reset()
    }, 3000)
  } catch (err) {
    console.error('Form submission error:', err)
  }
}

watch(() => props.isOpen, async (newVal, oldVal) => {
  if (newVal && !oldVal) {
    document.body.style.overflow = 'hidden'
    reset()
    // Inicializar Choices.js após o modal abrir
    await nextTick()
    setTimeout(() => {
      initChoicesInstances()
    }, 100)
  } else if (!newVal) {
    document.body.style.overflow = ''
    destroyChoicesInstances()
  }
})

watch(() => props.userType, () => {
  if (props.isOpen) {
    reset()
    formData.value = resetFormData()
    formErrors.value = {}
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

          <!-- Back Button -->
          <button 
            class="fixed top-6 left-6 md:top-8 md:left-8 text-stone-50 hover:text-zinc-400 transition-colors z-10 p-2 flex items-center gap-2"
            @click="handleBack"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            <span class="text-sm font-light font-['Manrope']">Voltar</span>
          </button>

          <div class="container mx-auto px-6 py-20 md:py-28">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
              
              <!-- Left Side - Info -->
              <div class="flex flex-col gap-8">
                <div>
                  <img src="/logos/place-white.svg" alt="OSPA place" class="h-16 w-auto mb-12">
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
                  {{ getFormConfig().title }}
                </h2>

                <!-- Success Message -->
                <div 
                  v-if="success" 
                  class="bg-green-900/30 border border-green-700 text-green-50 px-4 py-3 rounded mb-4"
                >
                  <p class="text-sm font-light font-['Manrope']">
                    Demo agendada com sucesso! Entraremos em contato em breve.
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

                  <!-- Row 2: Telefone e Estado -->
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

                    <!-- Estado Field -->
                    <div>
                      <label for="estado" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Estado *
                      </label>
                      <select
                        ref="estadoSelectRef"
                        id="estado"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                      >
                        <option value="">Selecione o estado</option>
                      </select>
                      <p v-if="formErrors.estado" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.estado }}
                      </p>
                    </div>
                  </div>

                  <!-- Row 3: Cidade e Setor/Órgão -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Cidade Field -->
                    <div>
                      <label for="cidade" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Cidade *
                      </label>
                      <select
                        ref="cidadeSelectRef"
                        id="cidade"
                        required
                        :disabled="loading || !formData.estado"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                      >
                        <option value="">{{ formData.estado ? 'Selecione a cidade' : 'Selecione primeiro o estado' }}</option>
                      </select>
                      <p v-if="formErrors.cidade" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.cidade }}
                      </p>
                    </div>

                    <!-- Setor de Atuação Field (apenas mercado) -->
                    <div v-if="!isGoverno">
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

                    <!-- Órgão Público Field (apenas governo) -->
                    <div v-if="isGoverno">
                      <label for="orgaoPublico" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Órgão público *
                      </label>
                      <input
                        id="orgaoPublico"
                        v-model="formData.orgaoPublico"
                        type="text"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                        placeholder="Nome do órgão público"
                      />
                      <p v-if="formErrors.orgaoPublico" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.orgaoPublico }}
                      </p>
                    </div>
                  </div>

                  <!-- Row 4: Empresa/Secretaria e Cargo -->
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <!-- Empresa Field (apenas mercado) -->
                    <div v-if="!isGoverno">
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

                    <!-- Secretaria/Departamento Field (apenas governo) -->
                    <div v-if="isGoverno">
                      <label for="secretaria" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Secretaria / Departamento *
                      </label>
                      <input
                        id="secretaria"
                        v-model="formData.secretaria"
                        type="text"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                        placeholder="Nome da secretaria ou departamento"
                      />
                      <p v-if="formErrors.secretaria" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.secretaria }}
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

                  <!-- Row 5: Revisão do Plano Diretor (apenas governo) -->
                  <div v-if="isGoverno" class="grid grid-cols-1 gap-4">
                    <div>
                      <label for="revisaoPlanoDiretor" class="block text-stone-50 text-sm font-light font-['Manrope'] mb-2">
                        Data de revisão do Plano Diretor *
                      </label>
                      <select
                        ref="revisaoPlanoDiretorSelectRef"
                        id="revisaoPlanoDiretor"
                        required
                        :disabled="loading"
                        class="w-full bg-zinc-700 border-none rounded px-4 py-3 text-stone-50 font-light font-['Manrope'] focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                      >
                        <option value="">Selecione uma opção</option>
                      </select>
                      <p v-if="formErrors.revisaoPlanoDiretor" class="mt-1 text-red-400 text-xs font-light font-['Manrope']">
                        {{ formErrors.revisaoPlanoDiretor }}
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
                    <span v-else>Agendar Demo</span>
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
