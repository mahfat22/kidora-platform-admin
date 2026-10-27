declare module '@bhplugin/vue3-datatable' {
    import type { DefineComponent } from 'vue';

    interface DatatableColumn {
        field: string;
        title: string;
        isUnique?: boolean;
    }

    const Vue3Datatable: DefineComponent<{
        rows: object[];
        columns: DatatableColumn[];
        totalRows?: number;
        search?: string;
        pageSize?: number;
        pageSizeOptions?: number[];
        sortColumn?: string;
        sortDirection?: 'asc' | 'desc';
        sortable?: boolean;
        skin?: string;
        paginationInfo?: string;
        noDataContent?: string;
    }>;

    export default Vue3Datatable;
}
