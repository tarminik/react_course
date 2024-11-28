import { generateId, generateNumericId, isValidId } from '../generate-id';

describe('generateId', () => {
    test('generates unique string ids', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
    });

    test('generates string type ids', () => {
        const id = generateId();
        expect(typeof id).toBe('string');
    });

    test('generates non-empty ids', () => {
        const id = generateId();
        expect(id.length).toBeGreaterThan(0);
    });
});

describe('generateNumericId', () => {
    test('generates sequential ids starting from 1 for empty array', () => {
        expect(generateNumericId([])).toBe('1');
    });

    test('generates next id after highest existing id', () => {
        const existingIds = ['1', '2', '3'];
        expect(generateNumericId(existingIds)).toBe('4');
    });

    test('handles non-sequential existing ids', () => {
        const existingIds = ['1', '4', '2'];
        expect(generateNumericId(existingIds)).toBe('5');
    });

    test('handles string and number mixed ids', () => {
        const existingIds = ['1', 2, '4'];
        expect(generateNumericId(existingIds)).toBe('5');
    });
});

describe('isValidId', () => {
    test('returns true for valid string ids', () => {
        expect(isValidId('abc123')).toBe(true);
    });

    test('returns true for valid numeric ids', () => {
        expect(isValidId(123)).toBe(true);
    });

    test('returns false for null', () => {
        expect(isValidId(null)).toBe(false);
    });

    test('returns false for undefined', () => {
        expect(isValidId(undefined)).toBe(false);
    });

    test('returns false for empty string', () => {
        expect(isValidId('')).toBe(false);
    });
});
