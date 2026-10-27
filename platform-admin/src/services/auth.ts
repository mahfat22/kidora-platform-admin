import { reactive } from 'vue';
import { ApiError, apiRequest, ensureCsrfCookie } from './api';
import type { PlatformAdmin, PlatformAdminResponse } from '../types/platformAdmin';

export const authState = reactive({
    admin: null as PlatformAdmin | null,
    initialized: false,
    isChecking: false,
    isSubmitting: false,
    isLoggingOut: false,
    sessionError: '',
});

export function expireSession(): void {
    authState.admin = null;
    authState.initialized = true;
    authState.sessionError = '';
}

let initialization: Promise<PlatformAdmin | null> | null = null;

function readAdmin(response: PlatformAdminResponse): PlatformAdmin {
    const admin = response?.data;
    if (
        !admin ||
        typeof admin.id !== 'number' ||
        typeof admin.name !== 'string' ||
        typeof admin.email !== 'string'
    ) {
        throw new ApiError('استجابة الحساب من الخادم غير مكتملة.', 500);
    }

    return admin;
}

export function initializeSession(force = false): Promise<PlatformAdmin | null> {
    if (initialization) {
        return initialization;
    }
    if (authState.initialized && !force && !authState.sessionError) {
        return Promise.resolve(authState.admin);
    }

    authState.isChecking = true;
    authState.sessionError = '';
    initialization = apiRequest<PlatformAdminResponse>('/auth/me')
        .then((response) => {
            authState.admin = readAdmin(response);
            authState.initialized = true;
            return authState.admin;
        })
        .catch((error: unknown) => {
            authState.admin = null;
            authState.initialized = true;

            if (error instanceof ApiError && error.status === 401) {
                return null;
            }

            authState.sessionError = error instanceof Error ? error.message : 'تعذر التحقق من الجلسة.';
            return null;
        })
        .finally(() => {
            authState.isChecking = false;
            initialization = null;
        });

    return initialization;
}

export async function login(email: string, password: string): Promise<PlatformAdmin> {
    authState.isSubmitting = true;
    authState.sessionError = '';

    try {
        await ensureCsrfCookie();
        let response: PlatformAdminResponse;
        try {
            response = await apiRequest<PlatformAdminResponse>('/auth/login', {
                method: 'POST',
                body: { email, password },
            });
        } catch (error) {
            if (!(error instanceof ApiError) || error.status !== 419) {
                throw error;
            }

            await ensureCsrfCookie();
            response = await apiRequest<PlatformAdminResponse>('/auth/login', {
                method: 'POST',
                body: { email, password },
            });
        }

        authState.admin = readAdmin(response);
        authState.initialized = true;
        return authState.admin;
    } finally {
        authState.isSubmitting = false;
    }
}

export async function logout(): Promise<void> {
    authState.isLoggingOut = true;
    try {
        await ensureCsrfCookie();
        await apiRequest<null>('/auth/logout', { method: 'POST' });
        authState.admin = null;
        authState.initialized = true;
        authState.sessionError = '';
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) {
            authState.admin = null;
            authState.initialized = true;
            authState.sessionError = '';
            return;
        }
        throw error;
    } finally {
        authState.isLoggingOut = false;
    }
}
