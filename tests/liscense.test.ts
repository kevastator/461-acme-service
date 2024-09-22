import { graphqlRequest } from '../src/graphql_request';
import logger from '../src/logger';
import { getLicense } from '../src/license';

// 6 test cases

jest.mock('../src/graphql_request');
jest.mock('../src/logger');

describe('getLicense', () => {
    const owner = 'testOwner';
    const repoName = 'testRepo';

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });


    // Test case for a valid MIT license returned from GraphQL
    it('should return a score of 1 for a valid MIT license from GraphQL', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    licenseInfo: {
                        key: 'MIT'
                    }
                }
            }
        });

        const [score, elapsed_time] = await getLicense(owner, repoName);
        expect(score).toBe(1);
        expect(elapsed_time).toBeGreaterThan(0);
    });

    // Test case for a valid LGPL-2.1 license returned from GraphQL
    it('should return a score of 1 for a valid LGPL-2.1 license from GraphQL', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    licenseInfo: {
                        key: 'LGPL-2.1'
                    }
                }
            }
        });

        const [score, elapsed_time] = await getLicense(owner, repoName);
        expect(score).toBe(1);
        expect(elapsed_time).toBeGreaterThan(0);
    });

    // Test case for a valid BSD-3-Clause license returned from GraphQL
    it('should return a score of 1 for a valid BSD-3-Clause license from GraphQL', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    licenseInfo: {
                        key: 'BSD-3-Clause'
                    }
                }
            }
        });

        const [score, elapsed_time] = await getLicense(owner, repoName);
        expect(score).toBe(1);
        expect(elapsed_time).toBeGreaterThan(0);
    });

    // Test case for an invalid license returned from GraphQL
    it('should return a score of 0 if no valid license is found', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    licenseInfo: {
                        key: 'Other'
                    }
                }
            }
        });

        const [score, elapsed_time] = await getLicense(owner, repoName);
        expect(score).toBe(0);
        expect(elapsed_time).toBeGreaterThan(0);
    });

    // Test case for handling a missing README file
    it('should handle a missing README and return score 0', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    licenseInfo: {
                        key: undefined
                    }
                }
            }
        });

        global.fetch = jest.fn().mockResolvedValueOnce({ ok: false });

        const [score, elapsed_time] = await getLicense(owner, repoName);
        expect(score).toBe(0);
        expect(elapsed_time).toBeGreaterThan(0);
    });

    // Test case for when the README contains a valid license
    it('should return a score of 1 if the README contains a valid license', async () => {
        (graphqlRequest as jest.Mock).mockResolvedValueOnce({
            data: {
                repository: {
                    licenseInfo: {
                        key: undefined
                    }
                }
            }
        });

        global.fetch = jest.fn()
            .mockResolvedValueOnce({
                ok: true,
                text: jest.fn().mockResolvedValueOnce('# License\nMIT License\n')
            });

        const [score, elapsed_time] = await getLicense(owner, repoName);
        expect(score).toBe(1);
        expect(elapsed_time).toBeGreaterThan(0);
    });
});