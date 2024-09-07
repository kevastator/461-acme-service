"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_env_1 = __importDefault(require("./config_env"));
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
// Simple enum to specify the level of verbosity the program wishes to write to
var VerbosityType;
(function (VerbosityType) {
    VerbosityType[VerbosityType["INFO"] = 1] = "INFO";
    VerbosityType[VerbosityType["DEBUG"] = 2] = "DEBUG";
})(VerbosityType || (VerbosityType = {}));
class Logger {
    constructor(firstWrite) {
        this.firstWrite = firstWrite;
    }
    printLog(message, verbosity_type = VerbosityType.INFO) {
        let testDirectory = path_1.default.dirname(config_env_1.default.LOG_FILE);
        if (!fs.existsSync(testDirectory)) {
            fs.mkdirSync(testDirectory);
        }
        if (verbosity_type == config_env_1.default.LOG_LEVEL) {
            if (this.firstWrite) {
                fs.writeFileSync(config_env_1.default.LOG_FILE, message + "\n");
                this.firstWrite = false;
            }
            else {
                fs.appendFileSync(config_env_1.default.LOG_FILE, message + "\n");
            }
        }
    }
    debug(message) {
        this.printLog(message, VerbosityType.DEBUG);
    }
    info(message) {
        this.printLog(message, VerbosityType.INFO);
    }
}
const logger = new Logger(true);
exports.default = logger;
