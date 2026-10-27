<template>
    <div class="space-y-6 sm:space-y-7">
        <section class="relative isolate overflow-hidden rounded-2xl bg-gradient-to-l from-[#124d45] to-primary px-5 py-6 text-white shadow-lg shadow-primary/10 sm:px-8 sm:py-8">
            <div class="pointer-events-none absolute -left-10 -top-16 -z-10 h-48 w-48 rounded-full border-[26px] border-white/[0.06]"></div>
            <div class="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-56 w-56 rounded-full bg-white/[0.04]"></div>
            <div class="relative flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
                <div>
                    <div class="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white/85">
                        <IconSun class="h-4 w-4 text-[#f9b954]" />
                        أهلاً بك في إدارة المنصة
                    </div>
                    <h2 class="text-2xl font-extrabold leading-relaxed sm:text-3xl">مرحبًا بك، مدير المنصة</h2>
                    <p class="mt-1.5 max-w-xl text-sm leading-6 text-white/75">نظرة عامة على الحضانات المسجلة في منصة Kidora.</p>
                </div>
                <RouterLink to="/nurseries" class="btn w-full justify-center border border-white/25 bg-white/10 text-white transition hover:bg-white/20 focus:ring-white/30 sm:w-auto">
                    <IconUsers class="h-4 w-4" />
                    استعراض الحضانات
                </RouterLink>
            </div>
        </section>

        <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <article class="panel relative overflow-hidden border border-[#e8f0ed] p-5 sm:p-6 sm:col-span-2 xl:col-span-1">
                <div class="absolute inset-x-0 top-0 h-1 bg-primary"></div>
                <div class="flex items-start justify-between gap-3">
                    <div class="min-w-0">
                        <p class="text-sm font-semibold text-gray-500">إجمالي الحضانات المسجلة</p>
                        <p v-if="loading" class="mt-3 h-9 w-24 animate-pulse rounded bg-[#e8f0ed]" role="status">
                            <span class="sr-only">جارٍ تحميل الإحصائيات...</span>
                        </p>
                        <p v-else-if="!error && totalNurseries !== null" class="mt-3 text-3xl font-extrabold tracking-tight text-[#183b36]">
                            {{ formatNumber(totalNurseries) }}
                        </p>
                        <p v-else class="mt-3 text-sm font-semibold text-gray-400">غير متاح حاليًا</p>
                        <p class="mt-2 text-xs text-gray-400">وفق البيانات المسجلة في المنصة</p>
                    </div>
                    <div class="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#e8f4f1] text-primary">
                        <IconUsers class="h-5 w-5" />
                    </div>
                </div>
            </article>
        </section>

        <section v-if="error" class="panel flex flex-col items-start gap-3 border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p class="text-sm leading-6 text-danger" role="alert">{{ error }}</p>
            <button type="button" class="btn btn-outline-primary shrink-0" :disabled="loading" @click="loadStatistics">
                {{ loading ? 'جارٍ إعادة المحاولة...' : 'إعادة المحاولة' }}
            </button>
        </section>

        <section v-else-if="!loading && totalNurseries === 0" class="panel border border-[#e8f0ed] px-5 py-10 text-center">
            <div class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f4f1] text-primary">
                <IconUsers class="h-6 w-6" />
            </div>
            <p class="mt-3 text-sm font-bold text-[#183b36]">لا توجد حضانات مسجلة حتى الآن</p>
            <p class="mt-1 text-xs text-gray-500">سيظهر العدد هنا بعد تسجيل الحضانات في المنصة.</p>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { ApiError } from '../services/api';
import { getPlatformStatistics } from '../services/platformAdminData';
import IconSun from '@theme/components/icon/icon-sun.vue';
import IconUsers from '@theme/components/icon/icon-users.vue';

const totalNurseries = ref<number | null>(null);
const loading = ref(true);
const error = ref('');

function formatNumber(value: number): string {
    return new Intl.NumberFormat('ar-EG').format(value);
}

async function loadStatistics(): Promise<void> {
    loading.value = true;
    error.value = '';
    try {
        totalNurseries.value = await getPlatformStatistics();
    } catch (requestError) {
        totalNurseries.value = null;
        error.value =
            requestError instanceof ApiError
                ? requestError.message
                : 'تعذر تحميل إحصائيات المنصة. حاول مرة أخرى.';
    } finally {
        loading.value = false;
    }
}

onMounted(() => void loadStatistics());
</script>
