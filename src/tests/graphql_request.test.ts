import { graphqlRequest } from '../graphql_request';
import config from '../config_env';

// Mock the config module
jest.mock('../config_env', () => ({
  GITHUB_TOKEN: 'mock-token'
}));

// Mock the global fetch function
global.fetch = jest.fn();

describe('graphqlRequest', () => {
  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  it('should return data when API request is successful', async () => {
    const mockData = { viewer: { login: 'mockUser' } };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: mockData, errors: undefined }),
    } as Response);

    const query = `query { viewer { login } }`;
    const data = await graphqlRequest(query);

    expect(data).toEqual(mockData);
    expect(fetch).toHaveBeenCalledWith('https://api.github.com/graphql', {
      method: 'POST',
      headers: { 'Authorization': 'bearer mock-token' },
      body: JSON.stringify({ query }),
    });
  });

  it('should reject with errors when API request returns errors', async () => {
    const mockErrors = [{ message: 'Error message' }];
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: null, errors: mockErrors }),
    } as Response);

    const query = `query { viewer { login } }`;
    await expect(graphqlRequest(query)).rejects.toEqual(mockErrors);
  });

  it('should reject with an error message when API request fails', async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    } as Response);

    const query = `query { viewer { login } }`;
    await expect(graphqlRequest(query)).rejects.toEqual('Error failed to get a response from the API');
  });
});
