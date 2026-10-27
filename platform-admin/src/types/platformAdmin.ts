export interface PlatformAdmin {
    id: number;
    name: string;
    email: string;
}

export interface PlatformAdminResponse {
    data: PlatformAdmin;
}

export interface LaravelErrorResponse {
    message?: string;
    errors?: Record<string, string[]>;
}
