import { ref, onUnmounted, nextTick } from 'vue'

let Choices = null

// Lazy load Choices.js
const loadChoices = async () => {
  if (!Choices) {
    const ChoicesModule = await import('choices.js')
    Choices = ChoicesModule.default || ChoicesModule
    // Importar CSS
    try {
      await import('choices.js/public/assets/styles/choices.min.css')
    } catch (e) {
      // CSS pode já estar importado ou não disponível
      console.warn('Could not import Choices.js CSS:', e)
    }
  }
  return Choices
}

export function useChoices() {
  const choicesInstances = ref([])

  const initChoices = async (element, options = {}) => {
    if (!element) return null

    await loadChoices()

    // Destruir instância existente se houver
    const existingIndex = choicesInstances.value.findIndex(inst => inst.element === element)
    if (existingIndex !== -1) {
      try {
        choicesInstances.value[existingIndex].instance.destroy()
      } catch (e) {
        console.warn('Error destroying existing Choices instance:', e)
      }
      choicesInstances.value.splice(existingIndex, 1)
    }

    const defaultOptions = {
      searchEnabled: true,
      searchChoices: true,
      itemSelectText: '',
      placeholder: true,
      placeholderValue: 'Selecione uma opção',
      shouldSort: false,
      classNames: {
        containerOuter: 'choices',
        containerInner: 'choices__inner',
        input: 'choices__input',
        inputCloned: 'choices__input--cloned',
        list: 'choices__list',
        listItems: 'choices__list--multiple',
        listSingle: 'choices__list--single',
        listDropdown: 'choices__list--dropdown',
        item: 'choices__item',
        itemSelectable: 'choices__item--selectable',
        itemDisabled: 'choices__item--disabled',
        itemChoice: 'choices__item--choice',
        placeholder: 'choices__placeholder',
        group: 'choices__group',
        groupHeading: 'choices__heading',
        button: 'choices__button',
        activeState: 'is-active',
        focusState: 'is-focused',
        openState: 'is-open',
        disabledState: 'is-disabled',
        highlightedState: 'is-highlighted',
        selectedState: 'is-selected',
        flippedState: 'is-flipped',
        loadingState: 'is-loading',
        noResults: 'has-no-results',
        noChoices: 'has-no-choices'
      },
      ...options
    }

    const instance = new Choices(element, defaultOptions)

    choicesInstances.value.push({ element, instance })
    return instance
  }

  const updateChoices = (instance, choices, value = null) => {
    if (!instance) {
      console.warn('updateChoices: instance is null')
      return
    }
    
    try {
      // Formatar choices para o formato esperado pelo Choices.js
      const formattedChoices = choices.map(choice => ({
        value: choice.value,
        label: choice.label,
        selected: false,
        disabled: false
      }))
      
      // Adicionar placeholder como primeira opção
      const placeholderLabel = instance.config.placeholderValue || 'Selecione uma opção'
      formattedChoices.unshift({
        value: '',
        label: placeholderLabel,
        selected: true,
        disabled: true,
        placeholder: true
      })
      
      // Usar destroy e reinicializar não é ideal, então vamos tentar outra abordagem
      // Primeiro limpar os items selecionados
      instance.removeActiveItems()
      
      // Usar o método interno _store para limpar e setar
      if (instance._store) {
        instance._store.dispatch({ type: 'CLEAR_CHOICES' })
      }
      
      // setChoices com replaceChoices=true deveria substituir
      instance.setChoices(formattedChoices, 'value', 'label', true)
      
      if (value) {
        nextTick(() => {
          instance.setChoiceByValue(value)
        })
      }
    } catch (e) {
      console.error('Error updating Choices:', e)
    }
  }

  const setValue = (instance, value) => {
    if (!instance) return
    try {
      instance.setChoiceByValue(value)
    } catch (e) {
      console.warn('Error setting Choices value:', e)
    }
  }

  const clearValue = (instance) => {
    if (!instance) return
    try {
      // Usar removeActiveItems para limpar apenas a seleção, não as opções
      instance.removeActiveItems()
    } catch (e) {
      console.warn('Error clearing Choices value:', e)
    }
  }

  const destroyInstance = (element) => {
    const index = choicesInstances.value.findIndex(inst => inst.element === element)
    if (index !== -1) {
      try {
        choicesInstances.value[index].instance.destroy()
      } catch (e) {
        console.warn('Error destroying Choices instance:', e)
      }
      choicesInstances.value.splice(index, 1)
    }
  }

  const destroyAll = () => {
    choicesInstances.value.forEach(({ instance }) => {
      try {
        instance.destroy()
      } catch (e) {
        console.warn('Error destroying Choices instance:', e)
      }
    })
    choicesInstances.value = []
  }

  onUnmounted(() => {
    destroyAll()
  })

  return {
    initChoices,
    updateChoices,
    setValue,
    clearValue,
    destroyInstance,
    destroyAll
  }
}
