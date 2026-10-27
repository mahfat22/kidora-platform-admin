import type { LaravelErrorResponse } from '../types/platformAdmin';

const API_PREFIX = '/admin/api';

export class ApiError extends Error {
    constructor(
        message: string,
        public readonly status: number,
        public readonly errors?: Record<string, string[]>,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

function getCookie(name: string): string | null {
    const cookie = document.cookie
        .split('; ')
        .find((entry) => entry.startsWith(`${name}=`));

    return cookie ? decodeURIComponent(cookie.slice(name.length + 1)) : null;
}

async function readResponseBody(response: Response): Promise<unknown> {
    if (response.status === 204) {
        return null;
    }

    const contentType = response.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) {
        return null;
    }

    return response.json();
}

export async function apiRequest<T>(
    path: string,
    options: {
        method?: 'GET' | 'POST';
        body?: unknown;
    } = {},
): Promise<T> {
    const method = options.method ?? 'GET';
    const headers = new Headers({
        Accept: 'application/json',
    });

    if (options.body !== undefined) {
        headers.set('Content-Type', 'application/json');
    }

    if (method !== 'GET') {
        const xsrfToken = getCookie('XSRF-TOKEN');
        if (!xsrfToken) {
            throw new ApiError('تعذر العثور على رمز حماية الطلب. أعد المحاولة.', 419);
        }
        headers.set('X-XSRF-TOKEN', xsrfToken);
    }

    let response: Response;
    try {
        response = await fetch(`${API_PREFIX}${path}`, {
            method,
            credentials: 'include',
            headers,
            body: options.body === undefined ? undefined : JSON.stringify(options.body),
        });
    } catch {
        throw new ApiError('تعذر الاتصال بخادم Kidora المحلي. تحقق من تشغيل Laravel.', 0);
    }

    const body = await readResponseBody(response);
    if (!response.ok) {
        const errorBody = (body && typeof body === 'object' ? body : {}) as LaravelErrorResponse;
        if (
            response.status === 401 &&
            !path.startsWith('/auth/') &&
            typeof window !== 'undefined'
        ) {
            window.dispatchEvent(new Event('platform-admin:session-expired'));
        }
        const message =
            response.status >= 500
                ? 'حدث خطأ في خادم Kidora المحلي. حاول لاحقًا أو تواصل مع الدعم.'
                : errorBody.message ?? `تعذر إكمال الطلب (HTTP ${response.status}).`;
        throw new ApiError(
            message,
            response.status,
            errorBody.errors,
        );
    }

    return body as T;
}

export async function ensureCsrfCookie(): Promise<void> {
    const response = await apiRequest<{ data?: { csrf_token?: string } }>('/csrf-cookie');
    if (!response?.data?.csrf_token || !getCookie('XSRF-TOKEN')) {
        throw new ApiError('لم يتمكن الخادم من تهيئة جلسة الحماية. أعد المحاولة.', 419);
    }
}
