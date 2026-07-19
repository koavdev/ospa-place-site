/**
 * Aplica máscara de telefone brasileiro: (00) 00000-0000
 * @param {string} value - Valor do telefone
 * @returns {string} - Telefone com máscara aplicada
 */
export function applyPhoneMask(value) {
  if (!value) return ''
  
  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, '')
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limitedNumbers = numbers.slice(0, 11)
  
  // Aplica máscara baseada no tamanho
  if (limitedNumbers.length <= 2) {
    return limitedNumbers.length > 0 ? `(${limitedNumbers}` : ''
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2, 7)}-${limitedNumbers.slice(7, 11)}`
  }
}

/**
 * Handler para evento de input de telefone
 * @param {Event} event - Evento de input
 * @param {Object} formDataRef - Objeto reativo com formData (ex: formData ref)
 */
export function handlePhoneInput(event, formDataRef) {
  const input = event.target
  
  // Remove caracteres não numéricos do valor atual
  const numbers = input.value.replace(/\D/g, '')
  
  // Limita a 11 dígitos
  const limitedNumbers = numbers.slice(0, 11)
  
  // Aplica máscara
  const newValue = applyPhoneMask(limitedNumbers)
  
  // Atualiza o valor no objeto reativo PRIMEIRO
  if (formDataRef.value) {
    formDataRef.value.phone = newValue
  }
  
  // Força atualização do input para garantir sincronização
  // Usa requestAnimationFrame para garantir que a atualização aconteça após o Vue processar
  requestAnimationFrame(() => {
    if (input.value !== newValue) {
      input.value = newValue
    }
  })
}

/**
 * Cria um computed reativo para o campo de telefone com máscara
 * @param {Object} formDataRef - Objeto reativo com formData (ex: formData ref)
 * @returns {Object} - Objeto com get e set para usar com v-model
 */
export function usePhoneMaskComputed(formDataRef) {
  return {
    get() {
      return formDataRef.value?.phone || ''
    },
    set(value) {
      if (!formDataRef.value) return
      
      // Remove caracteres não numéricos
      const numbers = String(value || '').replace(/\D/g, '')
      
      // Limita a 11 dígitos
      const limitedNumbers = numbers.slice(0, 11)
      
      // Aplica máscara e atualiza
      formDataRef.value.phone = applyPhoneMask(limitedNumbers)
    }
  }
}
