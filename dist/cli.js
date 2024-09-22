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
//Code Update
const readline = __importStar(require("readline")); // reading strings
const axios_1 = __importDefault(require("axios")); // For fetching data from GitHub or npm
const logger_1 = __importDefault(require("./logger")); // Import the logger
const url_parse_1 = require("./url_parse"); //parsing github and npm urls
const bus_factor_1 = require("./bus_factor"); //imports metric for calculating bus factor
const correctness_1 = require("./correctness"); // imports metric for calculating correctness
const ramp_up_metric_1 = require("./ramp_up_metric"); // imports metric for calculating correctness
const responsive_maintainer_1 = require("./responsive_maintainer"); // imports metric for calculating responsive maintainance
const license_1 = require("./license"); // imports metric for determining license compatibility
// Create a readline interface for interactive input
const cl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Placeholder function to analyze the repository
const analyzeRepository = async (repoUrl) => {
    try {
        // Log the start of the analysis
        logger_1.default.info(`Starting analysis of repository: ${repoUrl}`);
        // Parse the URL using the urlParser to get the owner and repo name
        var start = new Date().getTime();
        const [owner, repo] = await (0, url_parse_1.parseURL)(repoUrl);
        if (!owner || !repo) {
            logger_1.default.info("Invalid URL or unsupported repository format.");
            return;
        }
        // Construct the GitHub API URL using the parsed owner and repo name
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
        // Log the GitHub API request
        logger_1.default.debug(`Fetching repository data from GitHub for ${owner}/${repo}`);
        const repoData = await axios_1.default.get(apiUrl);
        const repoInfo = repoData.data;
        // Fetching contributors, issues, and commits data
        logger_1.default.debug(`Fetching contributors, issues, and commits for ${owner}/${repo}`);
        const contributorsData = await axios_1.default.get(`${apiUrl}/contributors`);
        const issuesData = await axios_1.default.get(`${apiUrl}/issues`);
        const commitsData = await axios_1.default.get(`${apiUrl}/commits`);
        const contributors = contributorsData.data;
        const issues = issuesData.data;
        const commits = commitsData.data;
        // Metric calculations:
        // Call getBusFactor to get the bus factor score and latency
        logger_1.default.debug(`Calculating Bus Factor for ${owner}/${repo}`);
        const [busFactor, busFactorLatency] = await (0, bus_factor_1.getBusFactor)(owner, repo);
        // Call getCorrectness to get the correctness score and latency
        logger_1.default.debug(`Calculating Correctness for ${owner}/${repo}`);
        const [correctness, correctnessLatency] = await (0, correctness_1.getCorrectness)(owner, repo);
        // Ramp-Up 
        logger_1.default.debug(`Calculating Ramp-Up Time for ${owner}/${repo}`);
        const rampUp = (0, ramp_up_metric_1.calculateTotalTimeFromRepo)(`https://github.com/${owner}/${repo}`);
        const rampUpLatency = 0; // Placeholder if no latency is calculated
        // Responsive Maintainer
        logger_1.default.debug(`Calculating Responsive Maintainer Score for ${owner}/${repo}`);
        const [responsiveMaintainer, responsiveMaintainerLatency] = await (0, responsive_maintainer_1.getResponsive)(owner, repo);
        // License Compatibility
        logger_1.default.debug(`Checking License Compatibility for ${owner}/${repo}`);
        const [license, licenseLatency] = await (0, license_1.getLicense)(owner, repo);
        // Calculate NetScore using all metrics
        logger_1.default.debug(`Calculating NetScore for ${owner}/${repo}`);
        const netScore = calculateNetScore(busFactor, correctness, rampUp, responsiveMaintainer, license);
        // Log completion of the analysis
        logger_1.default.info(`Analysis completed for repository: ${repoUrl}`);
        // Output the result in JSON format (for NDJSON)
        const result = {
            URL: repoUrl,
            NetScore: Number(netScore.toFixed(2)),
            NetScore_Latency: Number(((new Date().getTime() - start) / 1000).toFixed(3)), // Placeholder for overall latency calculation
            RampUp: Number(rampUp.toFixed(2)),
            RampUp_Latency: Number(rampUpLatency.toFixed(3)),
            Correctness: Number(correctness.toFixed(2)),
            Correctness_Latency: Number(correctnessLatency.toFixed(3)),
            BusFactor: Number(busFactor.toFixed(2)),
            BusFactor_Latency: Number(busFactorLatency.toFixed(3)),
            ResponsiveMaintainer: Number(responsiveMaintainer.toFixed(2)),
            ResponsiveMaintainer_Latency: Number(responsiveMaintainerLatency.toFixed(3)),
            License: Number(license.toFixed(2)),
            License_Latency: Number(licenseLatency.toFixed(3))
        };
        // Output result to stdout
        console.log(JSON.stringify(result));
    }
    catch (error) {
        // Log the error
        if (error instanceof Error) {
            logger_1.default.info(`Failed to analyze repository: ${repoUrl}. Error: ${error.message}`);
        }
        else {
            logger_1.default.info(`Failed to analyze repository: ${repoUrl}. An unknown error occurred.`);
        }
    }
};
// NetScore Calculation
const calculateNetScore = (busFactor, correctness, rampUp, responsiveMaintainer, license) => {
    return ((0.3 * busFactor) + (0.25 * correctness) + (0.25 * rampUp) + (0.2 * responsiveMaintainer)) * license;
};
// Command-line arguments handling
const args = process.argv.slice(2);
if (args.length === 0) {
    logger_1.default.infoDebug("Please provide a repository URL as an argument, or enter interactive mode.");
    logger_1.default.infoDebug("Example: ./cli analyze <repository-url>");
    startInteractiveMode();
}
else {
    const command = args[0];
    if (command === 'analyze' && args[1]) {
        const repoUrl = args[1];
        analyzeRepository(repoUrl);
    }
    else {
        logger_1.default.infoDebug("Invalid command or missing repository URL. Use './cli analyze <repository-url>' or run interactively.");
        process.exit(1);
    }
}
// Interactive mode for reading user input
function startInteractiveMode() {
    cl.question('Enter the repository URL to analyze: ', (input) => {
        if (input) {
            analyzeRepository(input);
        }
        else {
            logger_1.default.infoDebug("No repository URL provided.");
        }
        cl.close();
    });
}
