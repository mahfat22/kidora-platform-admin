export function formatArabicDate(date: string): string {
    const dateOnly = date.slice(0, 10);
    return new Intl.DateTimeFormat('ar-EG-u-ca-gregory', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(`${dateOnly}T00:00:00`));
}
