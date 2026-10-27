<template>
    <div class="min-h-screen bg-[#f5f8f7] text-[#183b36]">
        <Transition name="fade">
            <button
                v-if="mobileMenuOpen"
                class="fixed inset-0 z-40 cursor-default bg-[#102f2a]/45 lg:hidden"
                aria-label="إغلاق القائمة"
                @click="mobileMenuOpen = false"
            ></button>
        </Transition>

        <aside
            class="fixed inset-y-0 right-0 z-50 flex w-[270px] flex-col border-l border-[#e5eeeb] bg-white transition-transform duration-300 lg:translate-x-0"
            :class="mobileMenuOpen ? 'translate-x-0 shadow-2xl' : 'translate-x-full'"
        >
            <div class="flex min-h-[82px] items-center gap-3 border-b border-[#edf2f0] px-6">
                <div class="min-w-0">
                    <p class="text-xl font-extrabold tracking-tight text-primary">Kidora</p>
                    <p class="mt-0.5 text-xs font-semibold text-gray-500">إدارة منصة Kidora</p>
                </div>
            </div>

            <div class="px-5 pb-2 pt-7 text-[11px] font-bold tracking-wide text-gray-400">القائمة الرئيسية</div>
            <nav class="space-y-1 px-3" aria-label="القائمة الرئيسية">
                <RouterLink
                    v-for="item in navigation"
                    :key="item.to"
                    :to="item.to"
                    class="group flex items-center gap-3 rounded-lg border-r-[3px] border-transparent px-4 py-3 text-sm font-semibold text-gray-600 transition duration-150 hover:bg-[#f0f7f5] hover:text-primary"
                    active-class="!border-primary !bg-[#eaf4f1] !text-primary"
                    @click="mobileMenuOpen = false"
                >
                    <component :is="item.icon" class="h-5 w-5 shrink-0 transition-colors group-hover:text-secondary" />
                    <span>{{ item.label }}</span>
                </RouterLink>
            </nav>

            <div class="mt-auto border-t border-[#edf2f0] p-4">
                <p class="px-4 py-2 text-xs font-semibold text-gray-500">{{ adminName }}</p>
                <p class="px-4 text-[11px] text-gray-400" dir="ltr">{{ authState.admin?.email }}</p>
            </div>
        </aside>

        <div class="min-h-screen lg:mr-[270px]">
            <header class="sticky top-0 z-30 flex min-h-[78px] items-center justify-between border-b border-[#e7eeeb] bg-white/95 px-4 backdrop-blur sm:px-7">
                <div class="flex min-w-0 items-center gap-3">
                    <button
                        type="button"
                        class="rounded-lg p-2 text-gray-600 transition hover:bg-[#f0f7f5] hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40 lg:hidden"
                        aria-label="فتح القائمة"
                        :aria-expanded="mobileMenuOpen"
                        @click="mobileMenuOpen = !mobileMenuOpen"
                    >
                        <IconMenu class="h-6 w-6" />
                    </button>
                    <div class="min-w-0">
                        <p class="truncate text-[11px] font-semibold text-gray-400 sm:text-xs">إدارة منصة Kidora / {{ pageTitle }}</p>
                        <h1 class="mt-0.5 truncate text-base font-extrabold text-[#183b36] sm:text-lg">{{ pageTitle }}</h1>
                    </div>
                </div>

                <div class="relative flex shrink-0 items-center gap-2 sm:gap-3">
                    <button
                        type="button"
                        class="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-[#f5f8f7] focus:outline-none focus:ring-2 focus:ring-secondary/40"
                        aria-label="قائمة مدير المنصة"
                        :aria-expanded="accountMenuOpen"
                        @click="accountMenuOpen = !accountMenuOpen"
                    >
                        <span class="grid h-9 w-9 place-items-center rounded-full bg-[#e8f4f1] text-sm font-extrabold text-primary">م</span>
                        <span class="hidden text-right sm:block">
                            <span class="block max-w-36 truncate text-xs font-bold text-[#183b36]">{{ adminName }}</span>
                            <span class="mt-0.5 block max-w-36 truncate text-[10px] text-gray-400" dir="ltr">{{ authState.admin?.email }}</span>
                        </span>
                        <IconCaretDown class="hidden h-4 w-4 text-gray-400 sm:block" />
                    </button>
                    <div
                        v-if="accountMenuOpen"
                        class="absolute left-0 top-full mt-2 w-56 rounded-xl border border-[#e7eeeb] bg-white p-3 shadow-xl"
                    >
                        <p class="text-sm font-bold text-[#183b36]">{{ adminName }}</p>
                        <p class="mt-1 text-xs text-gray-500" dir="ltr">{{ authState.admin?.email }}</p>
                        <p v-if="logoutError" class="mt-3 rounded-lg bg-danger/5 p-2 text-xs leading-5 text-danger" role="alert">{{ logoutError }}</p>
                        <button
                            type="button"
                            class="mt-3 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-xs font-semibold text-danger transition hover:bg-danger/5 disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="authState.isLoggingOut"
                            @click="handleLogout"
                        >
                            <IconLogout class="h-4 w-4" />
                            {{ authState.isLoggingOut ? 'جارٍ تسجيل الخروج...' : 'تسجيل الخروج' }}
                        </button>
                    </div>
                </div>
            </header>

            <main class="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">
                <RouterView />
                <footer class="mt-10 border-t border-[#e7eeeb] py-4 text-center text-[11px] text-gray-400">
                    Kidora · إدارة المنصة
                </footer>
            </main>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import IconCaretDown from '@theme/components/icon/icon-caret-down.vue';
import IconChartSquare from '@theme/components/icon/icon-chart-square.vue';
import IconLogout from '@theme/components/icon/icon-logout.vue';
import IconMenu from '@theme/components/icon/icon-menu.vue';
import IconUsers from '@theme/components/icon/icon-users.vue';
import { ApiError } from '../services/api';
import { authState, logout } from '../services/auth';

const route = useRoute();
const router = useRouter();
const mobileMenuOpen = ref(false);
const accountMenuOpen = ref(false);
const logoutError = ref('');
const pageTitle = computed(() => String(route.meta.title ?? 'لوحة التحكم'));
const adminName = computed(() => authState.admin?.name ?? 'مدير المنصة');
const navigation = [
    { label: 'لوحة التحكم', to: '/dashboard', icon: IconChartSquare },
    { label: 'الحضانات', to: '/nurseries', icon: IconUsers },
];

async function handleLogout() {
    logoutError.value = '';
    try {
        await logout();
        accountMenuOpen.value = false;
        await router.replace('/login');
    } catch (error) {
        logoutError.value =
            error instanceof ApiError
                ? error.message
                : 'تعذر تسجيل الخروج. تحقق من الاتصال ثم حاول مرة أخرى.';
    }
}

watch(
    () => route.fullPath,
    () => {
        mobileMenuOpen.value = false;
        accountMenuOpen.value = false;
    },
);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 180ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
