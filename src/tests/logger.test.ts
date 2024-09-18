import logger from '../logger'; 
import config from '../config_env';
import * as fs from 'fs';
import path from 'path';

// Mock the config module
jest.mock('../config_env', () => ({
  LOG_FILE: 'test/logfile.log',
  LOG_LEVEL: 1
}));

// Mock the fs and path modules
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  mkdirSync: jest.fn(),
  writeFileSync: jest.fn(),
  appendFileSync: jest.fn()
}));

jest.mock('path', () => ({
  dirname: jest.fn()
}));

describe('Logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create directory if it does not exist', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
    (path.dirname as jest.Mock).mockReturnValueOnce('test/dir');

    logger.info('Test info message');

    expect(fs.existsSync).toHaveBeenCalledWith('test/dir');
    expect(fs.mkdirSync).toHaveBeenCalledWith('test/dir');
  });

  it('should write to file on first write', () => {
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

    logger.info('Test info message');

    expect(fs.writeFileSync).toHaveBeenCalledWith('test/logfile.log', 'Test info message\n');
  });

  it('should append to file after first write', () => {
    // Simulate that file has already been written to
    (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
    (fs.writeFileSync as jest.Mock).mockImplementationOnce(() => {});
    logger['firstWrite'] = false; // Set flag to false to simulate subsequent writes

    logger.info('Test info message');

    expect(fs.appendFileSync).toHaveBeenCalledWith('test/logfile.log', 'Test info message\n');
  });

  it('should log messages based on verbosity level', () => {
    // Test if `printLog` method is called with the right parameters
    const spy = jest.spyOn(logger as any, 'printLog');
    logger.info('Test info message');
    expect(spy).toHaveBeenCalledWith('Test info message', 1);
    spy.mockRestore();
  });
});
