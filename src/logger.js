"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config_env_1 = require("./config_env");
var path_1 = require("path");
var fs = require("fs");
// Simple enum to specify the level of verbosity the program wishes to write to
var VerbosityType;
(function (VerbosityType) {
    VerbosityType[VerbosityType["SILENT"] = 0] = "SILENT";
    VerbosityType[VerbosityType["INFO"] = 1] = "INFO";
    VerbosityType[VerbosityType["DEBUG"] = 2] = "DEBUG";
})(VerbosityType || (VerbosityType = {}));
// Custom Logger class
var Logger = /** @class */ (function () {
    function Logger() {
        this.firstWrite = true;
    }
    Logger.prototype.printLog = function (message, verbosity_type) {
        if (verbosity_type === void 0) { verbosity_type = VerbosityType.INFO; }
        // Check if the verbosity type is valid according to the .env file
        if (verbosity_type == config_env_1.default.LOG_LEVEL && config_env_1.default.LOG_LEVEL != 0) {
            var testDirectory = path_1.default.dirname(config_env_1.default.LOG_FILE); // extract the directory from the logfile path
            // If it does not exist create the directory
            if (!fs.existsSync(testDirectory)) {
                fs.mkdirSync(testDirectory);
            }
            // If this is the first write to the file write file sync and disable the check flag, otherwise append to it
            if (this.firstWrite) {
                fs.writeFileSync(config_env_1.default.LOG_FILE, message + "\n");
                this.firstWrite = false;
            }
            else {
                fs.appendFileSync(config_env_1.default.LOG_FILE, message + "\n");
            }
        }
    };
    // For console debug messages
    Logger.prototype.debug = function (message) {
        this.printLog(message, VerbosityType.DEBUG);
    };
    // For console info messages
    Logger.prototype.info = function (message) {
        this.printLog(message, VerbosityType.INFO);
    };
    // For console info and debug messages
    Logger.prototype.infoDebug = function (message) {
        this.printLog(message, config_env_1.default.LOG_LEVEL);
    };
    return Logger;
}());
// Export our logger for use in other modules
var logger = new Logger();
exports.default = logger;
