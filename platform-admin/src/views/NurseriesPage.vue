<template>
    <div class="space-y-6 sm:space-y-7">
        <section class="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
                <div class="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-400">
                    <span>إدارة المنصة</span>
                    <span aria-hidden="true">/</span>
                    <span class="text-primary">الحضانات</span>
                </div>
                <h2 class="text-2xl font-extrabold text-[#183b36]">الحضانات</h2>
                <p class="mt-1.5 text-sm text-gray-500">استعرض سجلات الحضانات المسجلة وابحث بينها.</p>
            </div>
            <label class="relative flex min-h-11 w-full items-center gap-2.5 rounded-xl border border-[#dfe9e5] bg-white px-3.5 transition focus-within:border-secondary focus-within:ring-4 focus-within:ring-secondary/10 sm:max-w-[360px]">
                <IconSearch class="h-[18px] w-[18px] shrink-0 text-gray-400" />
                <input
                    v-model="search"
                    type="search"
                    class="w-full border-0 bg-transparent p-0 text-sm text-[#183b36] placeholder:text-gray-400 focus:ring-0"
                    placeholder="ابحث باسم الحضانة أو المسؤول أو البريد الإلكتروني..."
                    aria-label="البحث في الحضانات"
                />
                <button
                    v-if="search"
                    type="button"
                    class="grid h-7 w-7 shrink-0 place-items-center rounded-md text-gray-400 transition hover:bg-[#f0f7f5] hover:text-primary"
                    aria-label="مسح البحث"
                    @click="search = ''"
                >
                    <IconX class="h-4 w-4" />
                </button>
            </label>
        </section>

        <section class="panel overflow-hidden border border-[#e8f0ed] p-0">
            <div class="flex flex-wrap items-center justify-between gap-2 border-b border-[#edf2f0] px-4 py-4 sm:px-6">
                <div>
                    <h3 class="text-base font-extrabold text-[#183b36]">قائمة الحضانات</h3>
                    <p class="mt-1 text-xs text-gray-500">البيانات معروضة من خادم Kidora.</p>
                </div>
                <span v-if="pagination" class="rounded-full bg-[#f0f7f5] px-3 py-1.5 text-xs font-bold text-primary">
                    {{ formatNumber(pagination.total) }} سجلًا
                </span>
            </div>

            <div v-if="error" class="m-4 flex flex-col items-start gap-3 rounded-xl border border-danger/20 bg-danger/5 p-4 sm:flex-row sm:items-center sm:justify-between">
                <p class="text-sm leading-6 text-danger" role="alert">{{ error }}</p>
                <button type="button" class="btn btn-outline-danger shrink-0" :disabled="loading" @click="loadNurseries">
                    {{ loading ? 'جارٍ إعادة المحاولة...' : 'إعادة المحاولة' }}
                </button>
            </div>

            <div v-else-if="loading" class="space-y-3 px-5 py-8" role="status" aria-live="polite">
                <div class="h-4 w-40 animate-pulse rounded bg-[#e8f0ed]"></div>
                <div class="h-10 animate-pulse rounded-lg bg-[#f4f7f6]"></div>
                <div class="h-10 animate-pulse rounded-lg bg-[#f4f7f6]"></div>
                <span class="sr-only">جارٍ تحميل بيانات الحضانات...</span>
            </div>

            <div v-else-if="nurseries.length === 0" class="px-5 py-14 text-center">
                <div class="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e8f4f1] text-primary">
                    <IconSearch class="h-5 w-5" />
                </div>
                <p class="mt-3 text-sm font-bold text-[#183b36]">
                    {{ search.trim() ? 'لا توجد نتائج تطابق عبارة البحث.' : 'لا توجد حضانات مسجلة.' }}
                </p>
                <p v-if="search.trim()" class="mt-1 text-xs text-gray-500">جرّب تعديل عبارة البحث أو مسحها.</p>
            </div>

            <div v-else class="overflow-x-auto">
                <table class="w-full min-w-[760px] text-right text-sm">
                    <thead class="bg-[#f8faf9] text-[11px] font-bold text-gray-500">
                        <tr>
                            <th class="px-5 py-3.5">اسم الحضانة</th>
                            <th class="px-5 py-3.5">اسم المسؤول</th>
                            <th class="px-5 py-3.5">البريد الإلكتروني</th>
                            <th class="px-5 py-3.5">تاريخ التسجيل</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="nursery in nurseries" :key="nursery.id" class="border-t border-[#f0f4f2] transition hover:bg-[#fbfdfc]">
                            <td class="px-5 py-4 font-bold text-[#183b36]">{{ nursery.name }}</td>
                            <td class="px-5 py-4 text-gray-600">{{ nursery.owner?.name ?? '—' }}</td>
                            <td class="px-5 py-4 text-gray-600" dir="ltr">{{ nursery.owner?.email ?? '—' }}</td>
                            <td class="px-5 py-4 text-gray-600">{{ formatDate(nursery.registered_at) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="!loading && !error && pagination && pagination.total > 0" class="flex flex-col gap-3 border-t border-[#edf2f0] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <div class="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
                    <span>
                        عرض {{ formatNumber(pagination.from ?? 0) }} إلى {{ formatNumber(pagination.to ?? 0) }}
                        من أصل {{ formatNumber(pagination.total) }} سجل
                    </span>
                    <label class="flex items-center gap-2">
                        <span>لكل صفحة</span>
                        <select v-model.number="perPage" class="form-select rounded-lg py-1.5 text-xs">
                            <option :value="8">8</option>
                            <option :value="15">15</option>
                            <option :value="30">30</option>
                        </select>
                    </label>
                </div>
                <div class="flex items-center gap-2">
                    <button
                        type="button"
                        class="btn btn-outline-primary px-3 py-2 text-xs"
                        :disabled="pagination.current_page <= 1 || loading"
                        @click="changePage(pagination.current_page - 1)"
                    >السابق</button>
                    <span class="min-w-24 text-center text-xs font-semibold text-gray-600">
                        صفحة {{ formatNumber(pagination.current_page) }} من {{ formatNumber(pagination.last_page) }}
                    </span>
                    <button
                        type="button"
                        class="btn btn-outline-primary px-3 py-2 text-xs"
                        :disabled="pagination.current_page >= pagination.last_page || loading"
                        @click="changePage(pagination.current_page + 1)"
                    >التالي</button>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import IconSearch from '@theme/components/icon/icon-search.vue';
import IconX from '@theme/components/icon/icon-x.vue';
import { ApiError } from '../services/api';
import { getNurseries, type NurseryPagination, type NurseryRecord } from '../services/platformAdminData';
import { formatArabicDate } from '../utils/date';

const perPage = ref(8);
const search = ref('');
const page = ref(1);
const nurseries = ref<NurseryRecord[]>([]);
const pagination = ref<NurseryPagination | null>(null);
const loading = ref(false);
const error = ref('');
let searchTimeout: number | undefined;
let latestRequest = 0;

function formatDate(value: string | null): string {
    return value ? formatArabicDate(value) : '—';
}

function formatNumber(value: number): string {
    return new Intl.NumberFormat('ar-EG').format(value);
}

async function loadNurseries(): Promise<void> {
    const requestId = ++latestRequest;
    loading.value = true;
    error.value = '';
    try {
        const result = await getNurseries({
            search: search.value,
            page: page.value,
            perPage: perPage.value,
        });
        if (requestId !== latestRequest) return;
        nurseries.value = result.nurseries;
        pagination.value = result.pagination;
    } catch (requestError) {
        if (requestId !== latestRequest) return;
        error.value =
            requestError instanceof ApiError
                ? requestError.message
                : 'تعذر تحميل الحضانات. حاول مرة أخرى.';
        nurseries.value = [];
        pagination.value = null;
    } finally {
        if (requestId === latestRequest) loading.value = false;
    }
}

function changePage(nextPage: number): void {
    page.value = nextPage;
    void loadNurseries();
}

watch(search, () => {
    window.clearTimeout(searchTimeout);
    page.value = 1;
    searchTimeout = window.setTimeout(() => void loadNurseries(), 300);
});

watch(perPage, () => {
    page.value = 1;
    void loadNurseries();
});

onMounted(() => void loadNurseries());
onBeforeUnmount(() => window.clearTimeout(searchTimeout));
</script>
