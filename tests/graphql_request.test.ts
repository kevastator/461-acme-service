import { graphqlRequest } from '../src/graphql_request';

// 4 test cases

describe('graphqlRequest', () => {
    const mockToken = 'mockToken';

    // Mocking the fetch function before each test
    beforeAll(() => {
        // Set the environment variable for the GitHub token
        process.env.GITHUB_TOKEN = mockToken;
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    // Test case for a successful GraphQL request with valid data
    it('should return data for a successful GraphQL request', async () => {
        const query = `{ viewer { login } }`;

        // Mocking the fetch function to return a successful response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                data: { viewer: { login: 'testUser' } },
                errors: undefined
            })
        });

        const response = await graphqlRequest(query);

        // Expect the response to contain the correct data
        expect(response).toEqual({ data: { viewer: { login: 'testUser' } }, errors: undefined });
    });

    // Test case for a GraphQL request that returns errors
    it('should reject with errors if the GraphQL request returns errors', async () => {
        const query = `{ viewer { login } }`;

        // Mocking the fetch function to return a response with errors
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                data: null,
                errors: [{ message: 'Invalid query' }]
            })
        });

        await expect(graphqlRequest(query)).rejects.toEqual([{ message: 'Invalid query' }]);
    });

    // Test case for a failed HTTP request (non-OK response)
    it('should reject with an error message if the response is not okay', async () => {
        const query = `{ viewer { login } }`;

        // Mocking the fetch function to return a non-OK response
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: false
        });

        await expect(graphqlRequest(query)).rejects.toEqual("Error failed to get a response from the API");
    });

    // Test case for an empty query string
    it('should throw an error for an empty query string', async () => {
        const query = '';

        // Mocking the fetch function for the empty query
        global.fetch = jest.fn().mockResolvedValueOnce({
            ok: true,
            json: jest.fn().mockResolvedValueOnce({
                data: null,
                errors: [{ message: 'Query cannot be empty' }]
            })
        });

        await expect(graphqlRequest(query)).rejects.toEqual([{ message: 'Query cannot be empty' }]);
    });
});
