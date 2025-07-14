import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

export function useCurrentUser() {
  const auth = useAuthStore()
  const currentUser = computed(() => auth.loggedUser)

  return { currentUser }
}
