"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Create a constant to be used globally, simple config object can be easily accessable across all other scripts
const config = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    LOG_LEVEL: Number(process.env.LOG_LEVEL),
    LOG_FILE: process.env.LOG_FILE
};
exports.default = config;
