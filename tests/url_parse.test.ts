import { parseURL } from '../src/url_parse'; // Adjust the import path as necessary

// 5 test cases

describe('parseURL function tests', () => {
    
    // Test for a valid GitHub URL
    it('should return owner and repo name for a valid GitHub URL', async () => {
        const url = 'https://github.com/user/repo';
        const result = await parseURL(url);
        expect(result).toEqual(['user', 'repo']);
    });

    // Test for a valid NPM URL that links to a GitHub repo
    it('should return owner and repo name for a valid NPM URL with GitHub repo', async () => {
        // Mock fetch for npm registry
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                repository: {
                    url: 'https://github.com/user/repo.git'
                }
            })
        });

        const url = 'https://www.npmjs.com/package/some-package';
        const result = await parseURL(url);
        expect(result).toEqual(['user', 'repo']);
    });

    // Test for a valid NPM URL that does not link to a GitHub repo
    it('should return empty strings for a valid NPM URL with no GitHub repo', async () => {
        // Mock fetch for npm registry
        global.fetch = jest.fn().mockResolvedValue({
            json: jest.fn().mockResolvedValue({
                repository: null
            })
        });

        const url = 'https://www.npmjs.com/package/another-package';
        const result = await parseURL(url);
        expect(result).toEqual(['', '']); // No GitHub link present
    });

    // Test for a non-GitHub and non-NPM URL
    it('should return empty strings for a non-GitHub and non-NPM URL', async () => {
        const url = 'https://example.com/not-a-github-or-npm-link';
        const result = await parseURL(url);
        expect(result).toEqual(['', '']); // Invalid link
    });

    // Test for an invalid GitHub URL
    it('should return empty strings for an invalid GitHub URL', async () => {
        const url = 'https://github.com/';
        const result = await parseURL(url);
        expect(result).toEqual(['', '']); // Invalid link with missing owner/repo
    });
});
