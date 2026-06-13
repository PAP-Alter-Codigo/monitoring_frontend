export function parseDate(str) {
    if (!str) return null;
    // DD/MM/YYYY
    const parts = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (parts) {
        const [, day, month, year] = parts.map(Number);
        if (month > 0 && month < 13) {
            const d = new Date(year, month - 1, day);
            if (d.getDate() === day && d.getMonth() === month - 1) return d;
        }
        return null;
    }
    // ISO 8601 / YYYY-MM-DD
    const d = new Date(str);
    return !isNaN(d) ? d : null;
}
