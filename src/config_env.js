"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv_1 = require("dotenv");
dotenv_1.default.config();
// Create a constant to be used globally, simple config object can be easily accessable across all other scripts
var config = {
    GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    LOG_LEVEL: Number(process.env.LOG_LEVEL),
    LOG_FILE: process.env.LOG_FILE
};
exports.default = config;
