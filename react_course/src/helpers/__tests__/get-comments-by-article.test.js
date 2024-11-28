import { getComments } from '../get-comments-by-article';
import comments from '../../data/comments.json';

jest.mock('../../data/comments.json', () => [
    { id: '1', articleId: '1', text: 'Comment 1' },
    { id: '2', articleId: '1', text: 'Comment 2' },
    { id: '3', articleId: '2', text: 'Comment 3' },
]);

describe('getComments', () => {
    beforeEach(() => {
        jest.useFakeTimers();
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    test('returns comments for specific article', async () => {
        const commentsPromise = getComments('1');
        jest.runAllTimers();
        
        const result = await commentsPromise;
        expect(result).toHaveLength(2);
        expect(result.every(comment => comment.articleId === '1')).toBe(true);
    });

    test('returns empty array for non-existent article', async () => {
        const commentsPromise = getComments('999');
        jest.runAllTimers();
        
        const result = await commentsPromise;
        expect(result).toHaveLength(0);
    });

    test('handles numeric article id', async () => {
        const commentsPromise = getComments(1);
        jest.runAllTimers();
        
        const result = await commentsPromise;
        expect(result).toHaveLength(2);
        expect(result.every(comment => comment.articleId === '1')).toBe(true);
    });

    test('returns promise that resolves after delay', async () => {
        const promise = getComments('1');
        expect(jest.getTimerCount()).toBe(1);
        
        jest.runAllTimers();
        await promise;
    });
});
