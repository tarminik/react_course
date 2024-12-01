import { getArticles } from '../get-articles';
import articles from '../../data/articles.json';

jest.mock('../../data/articles.json', () => [
    { id: '1', title: 'Article 1' },
    { id: '2', title: 'Article 2' },
]);

describe('getArticles', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('returns all articles', async () => {
        const articlesPromise = getArticles();
        jest.runAllTimers();
        
        const result = await articlesPromise;
        expect(result).toEqual(articles);
        expect(result).toHaveLength(2);
    });

    test('returns promise that resolves after delay', async () => {
        const promise = getArticles();
        expect(jest.getTimerCount()).toBe(1);
        
        jest.runAllTimers();
        await promise;
    });

    test('returns array of articles with required properties', async () => {
        const articlesPromise = getArticles();
        jest.runAllTimers();
        
        const result = await articlesPromise;
        result.forEach(article => {
            expect(article).toHaveProperty('id');
            expect(article).toHaveProperty('title');
        });
    });
});
