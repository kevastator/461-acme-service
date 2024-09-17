import config from "./config_env"
import path from "path"
import * as fs from 'fs';

// Simple enum to specify the level of verbosity the program wishes to write to
enum VerbosityType
{
    SILENT = 0,
    INFO = 1,
    DEBUG = 2
}

// Custom Logger class
class Logger {
    private firstWrite: boolean;

    public constructor() {
        this.firstWrite = true;
    }

    private printLog(message: string, verbosity_type: VerbosityType = VerbosityType.INFO)
    {
        // Check if the verbosity type is valid according to the .env file
        if (verbosity_type == config.LOG_LEVEL && config.LOG_LEVEL != 0)
        {
            let testDirectory: string = path.dirname(config.LOG_FILE); // extract the directory from the logfile path
            
            // If it does not exist create the directory
            if (!fs.existsSync(testDirectory))
            {
                fs.mkdirSync(testDirectory);
            }

            // If this is the first write to the file write file sync and disable the check flag, otherwise append to it
            if (this.firstWrite)
            {
                fs.writeFileSync(config.LOG_FILE, message + "\n");
                this.firstWrite = false;
            }
            else
            {
                fs.appendFileSync(config.LOG_FILE, message + "\n");
            }
        }
    }

    // For console debug messages
    public debug(message: string)
    {
        this.printLog(message, VerbosityType.DEBUG);
    }

    // For console info messages
    public info(message: string)
    {
        this.printLog(message, VerbosityType.INFO);
    }

    // For console info and debug messages
    public infoDebug(message: string)
    {
        this.printLog(message, config.LOG_LEVEL);
    }
}

// Export our logger for use in other modules
const logger = new Logger();

export default logger;