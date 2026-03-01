import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { onAuth, getUserRole, logout as authLogout } from '@/services/auth'
import { getPhotographer } from '@/services/photographer'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const role = ref(null)
  const photographerProfile = ref(null)
  const loading = ref(true)
  const initialized = ref(false)
  const isLoggedIn = computed(() => !!user.value && !user.value.isAnonymous)
  const isPhotographer = computed(() => role.value === 'photographer' || role.value === 'admin')
  const isAdmin = computed(() => role.value === 'admin')
  const uid = computed(() => user.value?.uid || null)

  function init() {
    if (initialized.value) return
    onAuth(async (u) => {
      user.value = u; loading.value = true
      if (u && !u.isAnonymous) {
        role.value = await getUserRole(u.uid)
        if (role.value === 'photographer') photographerProfile.value = await getPhotographer(u.uid)
      } else { role.value = null; photographerProfile.value = null }
      loading.value = false
    })
    initialized.value = true
  }

  async function logout() { await authLogout(); user.value = null; role.value = null; photographerProfile.value = null }
  async function refreshPhotographerProfile() { if (uid.value && role.value === 'photographer') photographerProfile.value = await getPhotographer(uid.value) }

  return { user, role, photographerProfile, loading, initialized, isLoggedIn, isPhotographer, isAdmin, uid, init, logout, refreshPhotographerProfile }
})
