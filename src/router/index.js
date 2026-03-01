import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'Home', component: () => import('@/views/public/HomePage.vue') },
  { path: '/quiz', name: 'Quiz', component: () => import('@/views/couple/QuizPage.vue') },
  { path: '/results', name: 'Results', component: () => import('@/views/couple/ResultsPage.vue') },
  { path: '/directory', name: 'Directory', component: () => import('@/views/public/DirectoryPage.vue') },
  { path: '/photographer/:id', name: 'PhotographerProfile', component: () => import('@/views/public/PhotographerProfilePage.vue'), props: true },
  { path: '/pricing', name: 'Pricing', component: () => import('@/views/public/PricingPage.vue') },
  { path: '/login', name: 'Login', component: () => import('@/views/auth/LoginPage.vue') },
  { path: '/signup/photographer', name: 'PhotographerSignup', component: () => import('@/views/photographer/SignupPage.vue') },
  { path: '/signup/couple', name: 'CoupleSignup', component: () => import('@/views/auth/CoupleSignup.vue') },
  { path: '/dashboard', name: 'Dashboard', component: () => import('@/views/photographer/DashboardPage.vue'), meta: { requiresAuth: true, role: 'photographer' } },
  { path: '/dashboard/profile', name: 'EditProfile', component: () => import('@/views/photographer/EditProfilePage.vue'), meta: { requiresAuth: true, role: 'photographer' } },
  { path: '/dashboard/quiz', name: 'PhotographerQuiz', component: () => import('@/views/photographer/PhotographerQuizPage.vue'), meta: { requiresAuth: true, role: 'photographer' } },
  { path: '/dashboard/inquiries', name: 'Inquiries', component: () => import('@/views/photographer/InquiriesPage.vue'), meta: { requiresAuth: true, role: 'photographer' } },
  { path: '/dashboard/upgrade', name: 'Upgrade', component: () => import('@/views/photographer/UpgradePage.vue'), meta: { requiresAuth: true, role: 'photographer' } },
  { path: '/admin', name: 'Admin', component: () => import('@/views/admin/AdminDashboard.vue'), meta: { requiresAuth: true, role: 'admin' } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('@/views/public/NotFoundPage.vue') }
]

const router = createRouter({ history: createWebHistory(), routes, scrollBehavior(to, from, saved) { if (to.hash) return { el: to.hash, behavior: 'smooth' }; return saved || { top: 0 } } })

router.beforeEach(async (to) => {
  if (to.meta.requiresAuth) {
    const { useAuthStore } = await import('@/stores/auth')
    const auth = useAuthStore()
    if (!auth.isLoggedIn) return { name: 'Login', query: { redirect: to.fullPath } }
    if (to.meta.role && auth.role !== to.meta.role && auth.role !== 'admin') return { name: 'Home' }
  }
})

export default router
