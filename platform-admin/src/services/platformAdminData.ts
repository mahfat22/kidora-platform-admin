import { ApiError, apiRequest } from './api';

export interface NurseryRecord {
    id: number;
    name: string;
    owner: {
        name: string;
        email: string;
    } | null;
    created_at: string | null;
    registered_at: string | null;
}

export interface NurseryPagination {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

interface NurseryListResponse {
    data: NurseryRecord[];
    meta: NurseryPagination;
}

export interface NurseryList {
    nurseries: NurseryRecord[];
    pagination: NurseryPagination;
}

interface StatisticsResponse {
    data: {
        registered_nurseries: number;
    };
}

function validateNurseryList(response: NurseryListResponse): NurseryList {
    if (
        !response ||
        !Array.isArray(response.data) ||
        !response.meta ||
        typeof response.meta.current_page !== 'number' ||
        typeof response.meta.last_page !== 'number' ||
        typeof response.meta.per_page !== 'number' ||
        typeof response.meta.total !== 'number'
    ) {
        throw new ApiError('استجابة قائمة الحضانات من الخادم غير مكتملة.', 500);
    }

    const validNurseries = response.data.every(
        (nursery) =>
            typeof nursery.id === 'number' &&
            typeof nursery.name === 'string' &&
            (nursery.owner === null ||
                (typeof nursery.owner?.name === 'string' &&
                    typeof nursery.owner?.email === 'string')) &&
            (nursery.registered_at === null || typeof nursery.registered_at === 'string') &&
            (nursery.created_at === null || typeof nursery.created_at === 'string'),
    );
    if (!validNurseries) {
        throw new ApiError('تحتوي استجابة قائمة الحضانات على بيانات غير صالحة.', 500);
    }

    return { nurseries: response.data, pagination: response.meta };
}

export async function getNurseries(options: {
    search: string;
    page: number;
    perPage: number;
}): Promise<NurseryList> {
    const query = new URLSearchParams({
        page: String(options.page),
        per_page: String(options.perPage),
        sort: 'created_at',
        direction: 'desc',
    });
    if (options.search.trim()) {
        query.set('search', options.search.trim());
    }

    const response = await apiRequest<NurseryListResponse>(`/nurseries?${query.toString()}`);
    return validateNurseryList(response);
}

export async function getPlatformStatistics(): Promise<number> {
    const response = await apiRequest<StatisticsResponse>('/statistics');
    if (
        !response?.data ||
        typeof response.data.registered_nurseries !== 'number' ||
        !Number.isFinite(response.data.registered_nurseries)
    ) {
        throw new ApiError('استجابة إحصائيات المنصة من الخادم غير مكتملة.', 500);
    }

    return response.data.registered_nurseries;
}
