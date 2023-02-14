import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'

const router = createRouter({
	history: createWebHashHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: '/login',
			component: () => import('@/views/login/Login.vue')
		},
		...routes
	]
})

export default router
