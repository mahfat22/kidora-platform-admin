<template>
    <main class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f5f8f7] px-4 py-8 sm:px-6 lg:py-12">
        <div class="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border-[36px] border-primary/[0.04]"></div>
        <div class="pointer-events-none absolute -bottom-36 -left-20 h-96 w-96 rounded-full bg-secondary/[0.05]"></div>

        <section class="relative grid w-full max-w-6xl overflow-hidden rounded-2xl border border-[#e7eeeb] bg-white shadow-xl shadow-[#1c4a40]/[0.08] md:min-h-[620px] md:grid-cols-2">
            <div class="relative isolate hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-[#124d45] via-primary to-[#208778] p-8 text-white md:flex lg:p-11">
                <div class="pointer-events-none absolute -left-16 -top-16 -z-10 h-64 w-64 rounded-full border-[34px] border-white/[0.07]"></div>
                <div class="pointer-events-none absolute -bottom-24 -right-20 -z-10 h-80 w-80 rounded-full bg-white/[0.05]"></div>
                <div class="pointer-events-none absolute bottom-24 left-10 -z-10 h-28 w-28 rounded-full border border-white/10"></div>

                <div>
                    <p class="text-2xl font-extrabold tracking-tight">Kidora</p>
                    <p class="mt-1 text-xs font-semibold text-white/65">إدارة المنصة</p>
                </div>

                <div class="max-w-md">
                    <span class="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white/85">
                        <span class="h-2 w-2 rounded-full bg-[#f9b954]"></span>
                        بوابة مدير المنصة
                    </span>
                    <h1 class="mt-5 text-3xl font-extrabold leading-[1.7] lg:text-4xl">كل حضانات Kidora،<br />في مكان واحد.</h1>
                    <p class="mt-4 max-w-sm text-sm leading-7 text-white/75">واجهة عربية لإدارة المنصة ومتابعة سجلات الحضانات من لوحة واحدة.</p>

                    <div class="mt-8 flex flex-wrap gap-2">
                        <span class="rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/85">لوحة إدارة مستقلة</span>
                        <span class="rounded-lg border border-white/15 bg-white/[0.08] px-3 py-2 text-xs font-semibold text-white/85">دعم كامل للعربية</span>
                    </div>
                </div>

                <p class="text-[11px] text-white/55">Kidora · إدارة المنصة</p>
            </div>

            <div class="flex flex-col justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-14">
                <div class="mb-8 flex items-center gap-3 md:hidden">
                    <div>
                        <p class="text-xl font-extrabold tracking-tight text-primary">Kidora</p>
                        <p class="mt-0.5 text-xs font-semibold text-gray-500">إدارة المنصة</p>
                    </div>
                </div>

                <div class="mx-auto w-full max-w-[420px]">
                    <p class="text-sm font-bold text-secondary">مرحبًا بعودتك</p>
                    <h2 class="mt-2 text-2xl font-extrabold text-[#183b36] sm:text-[28px]">دخول مدير المنصة</h2>
                    <p class="mt-2 text-sm leading-6 text-gray-500">أدخل بيانات الحساب للمتابعة إلى لوحة الإدارة.</p>

                    <div class="mt-6 flex items-start gap-2.5 rounded-xl border border-[#f1e3c5] bg-[#fffaf0] px-3.5 py-3 text-xs leading-5 text-[#735a2b]">
                        <IconInfoCircle class="mt-0.5 h-4 w-4 shrink-0 text-[#c38a29]" />
                        <p>سجّل الدخول بحساب مدير المنصة. لا تستخدم بيانات دخول الحضانة.</p>
                    </div>

                    <p v-if="authState.sessionError" class="mt-4 rounded-lg border border-danger/20 bg-danger/5 p-3 text-xs leading-5 text-danger" role="alert">
                        {{ authState.sessionError }}
                    </p>

                    <form class="mt-6 space-y-5" @submit.prevent="submitLogin">
                        <div>
                            <label for="platform-email" class="mb-2 block text-sm font-bold text-[#294a44]">البريد الإلكتروني</label>
                            <div class="relative">
                                <IconMail class="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                                <input
                                    id="platform-email"
                                    v-model="email"
                                    class="form-input w-full rounded-lg pe-11"
                                    type="email"
                                    dir="ltr"
                                    autocomplete="username"
                                    inputmode="email"
                                    placeholder="name@example.com"
                                    required
                                    aria-required="true"
                                    :disabled="authState.isSubmitting"
                                    @invalid="notice = 'تحقق من صحة البريد الإلكتروني وأكمل الحقول المطلوبة.'"
                                    @input="notice = ''"
                                />
                            </div>
                        </div>

                        <div>
                            <label for="platform-password" class="mb-2 block text-sm font-bold text-[#294a44]">كلمة المرور</label>
                            <div class="relative">
                                <IconLockDots class="pointer-events-none absolute right-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-400" />
                                <input
                                    id="platform-password"
                                    v-model="password"
                                    class="form-input w-full rounded-lg pe-11 ps-12"
                                    :type="showPassword ? 'text' : 'password'"
                                    dir="ltr"
                                    autocomplete="off"
                                    placeholder="أدخل كلمة المرور"
                                    required
                                    aria-required="true"
                                    :disabled="authState.isSubmitting"
                                    @invalid="notice = 'أدخل كلمة المرور للمتابعة.'"
                                    @input="notice = ''"
                                />
                                <button
                                    type="button"
                                    class="absolute left-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-md text-gray-400 transition hover:bg-[#f0f7f5] hover:text-primary focus:outline-none focus:ring-2 focus:ring-secondary/40"
                                    :aria-label="showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'"
                                    :aria-pressed="showPassword"
                                    :disabled="authState.isSubmitting"
                                    @click="showPassword = !showPassword"
                                >
                                    <IconEye class="h-[18px] w-[18px]" />
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            :disabled="authState.isSubmitting"
                            class="btn btn-primary w-full justify-center gap-2 rounded-lg py-3 text-sm font-bold shadow-sm shadow-primary/15 transition hover:-translate-y-px disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span v-if="authState.isSubmitting" class="h-4 w-4 animate-spin rounded-full border-2 border-white border-l-transparent"></span>
                            <IconLogin v-else class="h-[18px] w-[18px]" />
                            {{ authState.isSubmitting ? 'جارٍ التحقق من الحساب...' : 'تسجيل الدخول' }}
                        </button>

                        <p v-if="notice" class="flex items-start gap-2 rounded-lg border border-[#f1e3c5] bg-[#fffaf0] p-3 text-xs leading-5 text-[#735a2b]" role="alert">
                            <IconInfoCircle class="mt-0.5 h-4 w-4 shrink-0" />
                            {{ notice }}
                        </p>
                    </form>

                    <p class="mt-7 text-center text-[11px] leading-5 text-gray-400">تُرسل بيانات الدخول إلى خادم Kidora المحلي فقط، ولا تُحفظ كلمة المرور في المتصفح.</p>
                </div>
            </div>
        </section>
    </main>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import IconEye from '@theme/components/icon/icon-eye.vue';
import IconInfoCircle from '@theme/components/icon/icon-info-circle.vue';
import IconLockDots from '@theme/components/icon/icon-lock-dots.vue';
import IconLogin from '@theme/components/icon/icon-login.vue';
import IconMail from '@theme/components/icon/icon-mail.vue';
import { ApiError } from '../services/api';
import { authState, login } from '../services/auth';

const router = useRouter();
const email = ref('');
const password = ref('');
const showPassword = ref(false);
const notice = ref('');

function getLoginError(error: unknown): string {
    if (!(error instanceof ApiError)) {
        return 'حدث خطأ غير متوقع أثناء تسجيل الدخول. حاول مرة أخرى.';
    }
    if (error.status === 401) {
        return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.';
    }
    if (error.status === 422) {
        return 'تحقق من صحة البريد الإلكتروني وكلمة المرور ثم أعد المحاولة.';
    }
    if (error.status === 429) {
        return 'تجاوزت عدد محاولات الدخول المسموح بها. انتظر قليلًا ثم حاول مجددًا.';
    }
    if (error.status === 419) {
        return 'انتهت صلاحية جلسة الحماية. أعد المحاولة.';
    }
    return error.message;
}

async function submitLogin() {
    notice.value = '';
    try {
        await login(email.value.trim(), password.value);
        await router.replace('/dashboard');
    } catch (error) {
        notice.value = getLoginError(error);
    } finally {
        password.value = '';
        showPassword.value = false;
    }
}
</script>
