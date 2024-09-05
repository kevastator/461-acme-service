import config from "./config_env"
import * as fs from 'fs';

// Simple enum to specify the level of verbosity the program wishes to write to
export enum VerbosityType
{
    INFO = 1,
    DEBUG = 2
}

// Simple function to print to a enviorment log file based of enviorment variables
export function printLog(message: string, verbosity_type: VerbosityType = VerbosityType.INFO)
{
    if (verbosity_type == config.LOG_LEVEL)
    {
        fs.appendFileSync(config.LOG_FILE, message + "\n");
    }
}