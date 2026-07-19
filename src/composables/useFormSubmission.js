import { ref } from 'vue'

// Usar a URL do CMS Laravel para a API de formulários
// Padronizado com PeopleSection.vue - usar VITE_API_BASE_URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_CMS_API_URL || 'https://cms.ospa.com.br'

// Debug: log da URL sendo usada (apenas em desenvolvimento)
if (import.meta.env.DEV) {
  console.log('API Base URL:', API_BASE_URL)
  console.log('VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL)
  console.log('VITE_CMS_API_URL:', import.meta.env.VITE_CMS_API_URL)
}

export function useFormSubmission() {
  const loading = ref(false)
  const error = ref(null)
  const success = ref(false)

  const submitForm = async (formId, formType, userType, formData) => {
    loading.value = true
    error.value = null
    success.value = false

    try {
      // Endpoint atualizado para a API Laravel: /api/v1/forms/submit
      const apiUrl = `${API_BASE_URL}/api/v1/forms/submit`
      
      // Debug em desenvolvimento
      if (import.meta.env.DEV) {
        console.log('Submitting form to:', apiUrl)
      }
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          formId,
          formType,
          userType: userType || null,
          data: formData
        })
      })

      // Verificar se a resposta é JSON antes de fazer parse
      const contentType = response.headers.get('content-type')
      const isJson = contentType && contentType.includes('application/json')

      if (!response.ok) {
        let errorMessage = 'Failed to submit form'
        
        if (isJson) {
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorData.message || errorMessage
          } catch (e) {
            console.error('Error parsing JSON error response:', e)
          }
        } else {
          // Se não for JSON, pode ser HTML (página de erro)
          const text = await response.text()
          console.error('Non-JSON error response:', text.substring(0, 200))
          errorMessage = `Server error (${response.status}): ${response.statusText}`
        }
        
        throw new Error(errorMessage)
      }

      if (!isJson) {
        throw new Error('Server returned non-JSON response')
      }

      const result = await response.json()
      success.value = true
      
      return result
    } catch (err) {
      error.value = err.message || 'An error occurred while submitting the form'
      console.error('Form submission error:', err)
      console.error('API URL attempted:', `${API_BASE_URL}/api/v1/forms/submit`)
      console.error('API_BASE_URL value:', API_BASE_URL)
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    loading.value = false
    error.value = null
    success.value = false
  }

  return {
    loading,
    error,
    success,
    submitForm,
    reset
  }
}
