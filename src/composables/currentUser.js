import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useCurrentUser() {
  const auth = useAuthStore()

  return {
    currentUser: computed(() => auth.loggedUser),
    impersonator: computed(() => auth.impersonatorUser),
    isImpersonating: computed(() => auth.isImpersonating),
  }
}
