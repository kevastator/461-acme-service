import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { calculateTotalTimeFromRepo, deleteDirectoryRecursive, cloneGitHubRepo, calculateMetrics, calculateTimeToProgram, getJavaScriptFiles} from '../src/ramp_up_metric';

// 5 test cases

// Mocking the necessary modules
jest.mock('fs');
jest.mock('child_process');

describe('Ramp Up Metric', () => {
    const testDir = 'test_repo';
    const testUrl = 'https://github.com/some-user/some-repo.git';

    beforeEach(() => {
        // Clear mocks before each test
        jest.clearAllMocks();
    });

    // Test for cloning a GitHub repository
    it('should clone a GitHub repository', () => {
        // Mock execSync to simulate cloning
        (execSync as jest.Mock).mockImplementation(() => {});

        // Call the clone function
        cloneGitHubRepo(testUrl, testDir);

        // Assert that execSync was called with the correct command
        expect(execSync).toHaveBeenCalledWith(`git clone --depth 1 ${testUrl} ${testDir}`, { stdio: 'inherit' });
    });

    // Test for deleting a directory recursively
    it('should delete a directory recursively', () => {
        // Mock fs.existsSync and fs.readdirSync
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        (fs.readdirSync as jest.Mock).mockReturnValue(['file1.js', 'file2.js']);

        // Mock fs.unlinkSync and fs.rmdirSync
        (fs.unlinkSync as jest.Mock).mockImplementation(() => {});
        (fs.rmdirSync as jest.Mock).mockImplementation(() => {});

        // Call the delete function
        deleteDirectoryRecursive(testDir);

        // Assert that fs.unlinkSync and fs.rmdirSync were called
        expect(fs.unlinkSync).toHaveBeenCalledTimes(2); // For each file
        expect(fs.rmdirSync).toHaveBeenCalledWith(testDir);
    });

    // Test for calculating Halstead metrics from JavaScript content
    it('should calculate Halstead metrics from JavaScript content', () => {
        const jsContent = `
            function add(a, b) {
                return a + b;
            }
        `;

        // Call the metrics calculation
        const metrics = calculateMetrics(jsContent);

        // Assert the calculated metrics
        expect(metrics).toEqual({
            eta1: expect.any(Number), // Distinct operators
            eta2: expect.any(Number), // Distinct operands
            N1: expect.any(Number),    // Total operators
            N2: expect.any(Number)     // Total operands
        });
    });

    // Test for calculating time to program based on Halstead metrics
    it('should calculate time to program based on Halstead metrics', () => {
        const metrics = {
            eta1: 3,
            eta2: 2,
            N1: 5,
            N2: 3
        };

        // Calculate time
        const time = calculateTimeToProgram(metrics);

        // Assert the calculated time
        expect(time).toBeGreaterThan(0); // Ensure it's a positive time
    });

    // Test for getting all JavaScript files in a directory
    it('should get all JavaScript files in a directory', () => {
        // Mock the file system
        (fs.readdirSync as jest.Mock).mockReturnValue(['file1.js', 'file2.txt', 'folder']);
        (fs.statSync as jest.Mock).mockImplementation((filePath) => {
            if (filePath === path.join(testDir, 'file1.js')) {
                return { isDirectory: () => false };
            }
            if (filePath === path.join(testDir, 'file2.txt')) {
                return { isDirectory: () => false };
            }
            return { isDirectory: () => true }; // Simulate a folder
        });

        // Call the function
        const files = getJavaScriptFiles(testDir);

        // Assert the result
        expect(files).toEqual([path.join(testDir, 'file1.js')]);
    });

    // Test for calculating total time from a GitHub repository
    it('should calculate total time from a GitHub repository', () => {
        // Mocking the necessary functions
        (execSync as jest.Mock).mockImplementation(() => {});
        (fs.readFileSync as jest.Mock).mockReturnValue(`
            function add(a, b) {
                return a + b;
            }
        `);

        // Mock getJavaScriptFiles to return a specific file
        (fs.readdirSync as jest.Mock).mockReturnValue(['file1.js']);
        (fs.statSync as jest.Mock).mockImplementation((filePath) => {
            return { isDirectory: () => false };
        });

        // Call the main function
        const result = calculateTotalTimeFromRepo(testUrl);

        // Assert the result is valid
        expect(result).toBeLessThan(1); // Assuming time_max is set to 100
    });

    // Test for handling errors during repository cloning
    it('should handle errors during repository cloning', () => {
        // Mock execSync to throw an error
        (execSync as jest.Mock).mockImplementation(() => {
            throw new Error('Clone failed');
        });

        // Call the function and expect an error
        expect(() => {
            calculateTotalTimeFromRepo(testUrl);
        }).toThrow('Clone failed');
    });
});