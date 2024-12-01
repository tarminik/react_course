export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

export function generateNumericId(existingIds = []) {
    const maxId = Math.max(...existingIds.map(id => parseInt(id)), 0);
    return (maxId + 1).toString();
}

export function isValidId(id) {
    if (!id) return false;
    return (typeof id === 'string' && id.length > 0) || typeof id === 'number';
}
