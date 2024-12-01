import { formatDate, isValidDate, getRelativeTimeString } from '../date-utils';

describe('formatDate', () => {
    test('formats date correctly for ru-RU locale', () => {
        const date = new Date('2023-12-25T12:00:00Z');
        const formatted = formatDate(date);
        expect(formatted).toMatch(/25\s+декабря\s+2023\s*г\.*/i);
    });

    test('formats date correctly for en-US locale', () => {
        const date = new Date('2023-12-25T12:00:00Z');
        const formatted = formatDate(date, 'en-US');
        expect(formatted).toMatch(/December\s+25,\s+2023/i);
    });

    test('handles string date input', () => {
        const dateString = '2023-12-25T12:00:00Z';
        const formatted = formatDate(dateString);
        expect(formatted).toMatch(/25\s+декабря\s+2023\s*г\.*/i);
    });
});

describe('isValidDate', () => {
    test('returns true for valid date string', () => {
        expect(isValidDate('2023-12-25')).toBe(true);
    });

    test('returns true for valid Date object', () => {
        expect(isValidDate(new Date())).toBe(true);
    });

    test('returns false for invalid date string', () => {
        expect(isValidDate('invalid-date')).toBe(false);
    });

    test('returns false for invalid input', () => {
        expect(isValidDate(null)).toBe(false);
        expect(isValidDate(undefined)).toBe(false);
        expect(isValidDate('')).toBe(false);
    });
});

describe('getRelativeTimeString', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(new Date('2023-12-25T12:00:00Z'));
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('returns "только что" for very recent dates', () => {
        const date = new Date('2023-12-25T11:59:30Z'); // 30 seconds ago
        expect(getRelativeTimeString(date)).toBe('только что');
    });

    test('returns minutes for dates less than an hour ago', () => {
        const date = new Date('2023-12-25T11:30:00Z'); // 30 minutes ago
        expect(getRelativeTimeString(date)).toBe('30 минут назад');
    });

    test('returns hours for dates less than a day ago', () => {
        const date = new Date('2023-12-25T06:00:00Z'); // 6 hours ago
        expect(getRelativeTimeString(date)).toBe('6 часов назад');
    });

    test('returns formatted date for dates more than a day ago', () => {
        const date = new Date('2023-12-20T12:00:00Z'); // 5 days ago
        expect(getRelativeTimeString(date)).toMatch(/20\s+декабря\s+2023\s*г\.*/i);
    });
});
