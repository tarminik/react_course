export function sortByDate(items, direction = 'desc') {
    return [...items].sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return direction === 'desc' ? dateB - dateA : dateA - dateB;
    });
}

export function sortByLikes(items, direction = 'desc') {
    return [...items].sort((a, b) => {
        return direction === 'desc' ? b.likes - a.likes : a.likes - b.likes;
    });
}

export function sortByField(items, field, direction = 'desc') {
    return [...items].sort((a, b) => {
        if (typeof a[field] === 'string') {
            return direction === 'desc' 
                ? b[field].localeCompare(a[field])
                : a[field].localeCompare(b[field]);
        }
        return direction === 'desc' ? b[field] - a[field] : a[field] - b[field];
    });
}
