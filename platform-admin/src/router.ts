import { createRouter, createWebHistory } from 'vue-router';
import AdminLayout from './layouts/AdminLayout.vue';
import { authState, expireSession, initializeSession } from './services/auth';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            redirect: '/dashboard',
        },
        {
            path: '/login',
            name: 'platform-login',
            component: () => import('./views/LoginPage.vue'),
            meta: { title: 'دخول مدير المنصة', public: true },
        },
        {
            path: '/',
            component: AdminLayout,
            children: [
                {
                    path: 'dashboard',
                    name: 'platform-dashboard',
                    component: () => import('./views/DashboardPage.vue'),
                    meta: { title: 'لوحة التحكم' },
                },
                {
                    path: 'nurseries',
                    name: 'platform-nurseries',
                    component: () => import('./views/NurseriesPage.vue'),
                    meta: { title: 'الحضانات' },
                },
            ],
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/dashboard',
        },
    ],
    scrollBehavior: () => ({ top: 0 }),
});

router.beforeEach(async (to) => {
    const admin = await initializeSession();
    const isLoginPage = to.name === 'platform-login';

    if (isLoginPage) {
        return admin && !authState.sessionError ? '/dashboard' : true;
    }

    if (!admin || authState.sessionError) {
        return '/login';
    }

    return true;
});

router.afterEach((to) => {
    document.title = `${String(to.meta.title ?? 'إدارة المنصة')} | كيدورا`;
});

if (typeof window !== 'undefined') {
    window.addEventListener('platform-admin:session-expired', () => {
        expireSession();
        void router.replace('/login');
    });
}

export default router;
