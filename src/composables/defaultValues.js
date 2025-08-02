// composables/usePersistentForm.js
import { reactive, watch, onMounted } from 'vue'

export function useDefautValues(storageKey, defaultValues) {
  const defValues = reactive({ ...defaultValues })

  onMounted(() => {
    try {
      const salvo = JSON.parse(localStorage.getItem(storageKey) || '{}')
      Object.assign(defValues, salvo)
    } catch (e) {
      console.warn('Erro ao carregar formulário:', e)
    }
  })

  watch(
    defValues,
    (novo) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(novo))
      } catch (e) {
        console.warn('Erro ao salvar formulário:', e)
      }
    },
    { deep: true }
  )

  return { defValues }
}
