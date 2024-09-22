import logger from '../src/logger';
import config from '../src/config_env';
import fs from 'fs';
import path from 'path';

// 4 test cases

// Mocking the fs module
jest.mock('fs');

describe('Logger', () => {
    beforeEach(() => {
        // Reset the mock implementation before each test
        jest.clearAllMocks();
        // Mock the log level and log file path
        config.LOG_LEVEL = 2; // Set to DEBUG level for testing
        config.LOG_FILE = './test_log.txt'; // Use a test log file
    });

    it('should create the log directory if it does not exist', () => {
        // Mock fs.existsSync to return false to simulate directory not existing
        (fs.existsSync as jest.Mock).mockReturnValue(false);
        
        // Call the debug method
        logger.debug('Test debug message');

        // Assert that the directory creation was called
        expect(fs.mkdirSync).toHaveBeenCalledWith(path.dirname(config.LOG_FILE));
    });

    it('should write a message to the log file on the first write', () => {
        // Mock fs.existsSync to return true to simulate directory existing
        (fs.existsSync as jest.Mock).mockReturnValue(true);
        
        // Mock the file write method
        const message = 'Test info message';
        (fs.writeFileSync as jest.Mock).mockImplementation(() => {});

        // Call the info method
        logger.info(message);

        // Assert that writeFileSync was called with the correct parameters
        expect(fs.writeFileSync).toHaveBeenCalledWith(config.LOG_FILE, message + "\n");
    });

    it('should append a message to the log file after the first write', () => {
        // Mock fs.existsSync to return true to simulate directory existing
        (fs.existsSync as jest.Mock).mockReturnValue(true);

        // Simulate first write completed
        logger.info('Initial write');
        
        // Mock the file append method
        const message = 'Test debug message';
        (fs.appendFileSync as jest.Mock).mockImplementation(() => {});

        // Call the debug method again
        logger.debug(message);

        // Assert that appendFileSync was called with the correct parameters
        expect(fs.appendFileSync).toHaveBeenCalledWith(config.LOG_FILE, message + "\n");
    });

    it('should not log messages if log level is SILENT', () => {
        // Set log level to SILENT
        config.LOG_LEVEL = 0;

        // Call the debug method
        logger.debug('This should not be logged');

        // Assert that neither writeFileSync nor appendFileSync was called
        expect(fs.writeFileSync).not.toHaveBeenCalled();
        expect(fs.appendFileSync).not.toHaveBeenCalled();
    });
});
