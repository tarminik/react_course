import { sortByDate, sortByLikes, sortByField } from '../sort-items';

describe('sortByDate', () => {
    const items = [
        { createdAt: '2023-12-01T10:00:00Z' },
        { createdAt: '2023-12-03T10:00:00Z' },
        { createdAt: '2023-12-02T10:00:00Z' }
    ];

    test('sorts items by date in descending order by default', () => {
        const sorted = sortByDate(items);
        expect(sorted[0].createdAt).toBe('2023-12-03T10:00:00Z');
        expect(sorted[2].createdAt).toBe('2023-12-01T10:00:00Z');
    });

    test('sorts items by date in ascending order', () => {
        const sorted = sortByDate(items, 'asc');
        expect(sorted[0].createdAt).toBe('2023-12-01T10:00:00Z');
        expect(sorted[2].createdAt).toBe('2023-12-03T10:00:00Z');
    });

    test('returns new array without modifying original', () => {
        const original = [...items];
        sortByDate(items);
        expect(items).toEqual(original);
    });
});

describe('sortByLikes', () => {
    const items = [
        { likes: 5 },
        { likes: 10 },
        { likes: 3 }
    ];

    test('sorts items by likes in descending order by default', () => {
        const sorted = sortByLikes(items);
        expect(sorted[0].likes).toBe(10);
        expect(sorted[2].likes).toBe(3);
    });

    test('sorts items by likes in ascending order', () => {
        const sorted = sortByLikes(items, 'asc');
        expect(sorted[0].likes).toBe(3);
        expect(sorted[2].likes).toBe(10);
    });

    test('returns new array without modifying original', () => {
        const original = [...items];
        sortByLikes(items);
        expect(items).toEqual(original);
    });
});

describe('sortByField', () => {
    const items = [
        { name: 'Charlie', value: 5 },
        { name: 'Alice', value: 10 },
        { name: 'Bob', value: 3 }
    ];

    test('sorts items by string field in descending order', () => {
        const sorted = sortByField(items, 'name');
        expect(sorted[0].name).toBe('Charlie');
        expect(sorted[2].name).toBe('Alice');
    });

    test('sorts items by string field in ascending order', () => {
        const sorted = sortByField(items, 'name', 'asc');
        expect(sorted[0].name).toBe('Alice');
        expect(sorted[2].name).toBe('Charlie');
    });

    test('sorts items by numeric field in descending order', () => {
        const sorted = sortByField(items, 'value');
        expect(sorted[0].value).toBe(10);
        expect(sorted[2].value).toBe(3);
    });

    test('sorts items by numeric field in ascending order', () => {
        const sorted = sortByField(items, 'value', 'asc');
        expect(sorted[0].value).toBe(3);
        expect(sorted[2].value).toBe(10);
    });

    test('returns new array without modifying original', () => {
        const original = [...items];
        sortByField(items, 'name');
        expect(items).toEqual(original);
    });
});
