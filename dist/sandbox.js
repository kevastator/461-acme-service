"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./logger"));
logger_1.default.info("This is an info line!");
logger_1.default.info("This is another info line!");
logger_1.default.debug("This is a debug line!");
logger_1.default.debug("This is another debug line!");
