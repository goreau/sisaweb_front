// services/FocusManager.js (Crie um serviço/store para gerenciar o foco)

import { reactive } from 'vue'

// O mapa armazenará { 'formId': [elemento1, elemento2, ...] }
const focusMap = reactive({})
var idForm = ''

export function registerElement(formId, el) {
  if (formId === 'submit-action') {
    focusMap[idForm].push(el)
  } else {
    idForm = formId
    if (!focusMap[formId]) {
      focusMap[formId] = []
    }
    // Adiciona o elemento, mas garante a ordem de TAB (será ordenado no focusNext)
    focusMap[formId].push(el)
  }
}

export function unregisterElement(formId, el) {
  if (focusMap[formId]) {
    focusMap[formId] = focusMap[formId].filter((item) => item !== el)
    if (focusMap[formId].length === 0) {
      delete focusMap[formId]
    }
  }
}

export function focusNext(formId, currentEl) {
  const elements = focusMap[formId]
  if (!elements) return false

  // 1. Garante que os elementos estão na ordem correta do DOM
  //    Isso resolve o problema de renderização assíncrona
  elements.sort((a, b) =>
    a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1,
  )

  // 2. Encontra o índice atual
  const currentIndex = elements.indexOf(currentEl)

  if (currentIndex !== -1 && currentIndex + 1 < elements.length) {
    const nextEl = elements[currentIndex + 1]

    if (
      nextEl.hasAttribute('data-focus-type') &&
      nextEl.getAttribute('data-focus-type') === 'custom-submit-group'
    ) {
      const targetButton = nextEl.querySelector('button.submit-btn')

      if (targetButton) {
        targetButton.focus() // ✅ MOVE O FOCO PARA O BOTÃO
        return
      } else {
        console.error('FocusManager: Falha ao focar o botão submit interno.')
        return
      }
    } else if (
      nextEl.hasAttribute('data-focus-type') &&
      nextEl.getAttribute('data-focus-type') === 'custom-checkbox-group'
    ) {
      // Foca no primeiro checkbox que aparecer (pode ser o "Selecionar Todos")
      const targetCheckbox = nextEl.querySelector('input[type="checkbox"]')

      if (targetCheckbox) {
        targetCheckbox.focus()
      } else {
        console.error('FocusManager: CheckboxGroup encontrado, mas falha ao focar o input interno.')
      }
    } else if (
      nextEl.hasAttribute('data-focus-type') &&
      nextEl.getAttribute('data-focus-type') === 'custom-radio-group'
    ) {
      // Foca no rádio que já está checado ou no primeiro da lista
      const selectedRadio = nextEl.querySelector('input[type="radio"]:checked')
      const targetRadio = selectedRadio || nextEl.querySelector('input[type="radio"]')

      if (targetRadio) {
        targetRadio.focus()
      } else {
        console.error('FocusManager: RadioGroup encontrado, mas falha ao focar o input interno.')
      }
    }
    // 1. Lógica para Selects/Combos Customizados (vue-select)
    else if (
      nextEl.hasAttribute('data-focus-type') &&
      nextEl.getAttribute('data-focus-type') === 'custom-select'
    ) {
      //const innerSelect = nextEl.querySelector('select') // 👈 Busca o SELECT interno
      const innerSelect = nextEl.querySelector('.vs__search')
      if (innerSelect) {
        innerSelect.focus()
      } else {
        console.error('FocusManager: Falha ao encontrar o SELECT interno do CmbGeneric.')
      }
    }
    // 2. Lógica para Datepicker Customizado
    else if (
      nextEl.hasAttribute('data-focus-type') &&
      nextEl.getAttribute('data-focus-type') === 'custom-datepicker'
    ) {
      const innerInput = nextEl.querySelector('.dp__input')
      if (innerInput) {
        innerInput.focus()
      }
    }
    // 3. Fallback: Inputs Nativos (que não precisam de customFocus)
    else if (typeof nextEl.focus === 'function') {
      nextEl.focus()
      if (nextEl.select) nextEl.select()
    } else {
      console.error('FocusManager: Elemento alvo não identificado para foco.', nextEl)
    }
    return true
  }
  return false
}
