"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
//Code Update
var readline = require("readline"); // reading strings
var axios_1 = require("axios"); // For fetching data from GitHub or npm
var logger_1 = require("./logger"); // Import the logger
var url_parse_1 = require("./url_parse"); //parsing github and npm urls
var bus_factor_1 = require("./bus_factor"); //imports metric for calculating bus factor
var correctness_1 = require("./correctness"); // imports metric for calculating correctness
var ramp_up_metric_1 = require("./ramp_up_metric"); // imports metric for calculating correctness
var responsive_maintainer_1 = require("./responsive_maintainer"); // imports metric for calculating responsive maintainance
var license_1 = require("./license"); // imports metric for determining license compatibility
// Create a readline interface for interactive input
var cl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// Placeholder function to analyze the repository
var analyzeRepository = function (repoUrl) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, owner, repo, apiUrl, repoData, repoInfo, contributorsData, issuesData, commitsData, contributors, issues, commits, _b, busFactor, busFactorLatency, _c, correctness, correctnessLatency, rampUp, rampUpLatency, _d, responsiveMaintainer, responsiveMaintainerLatency, _e, license, licenseLatency, netScore, result, error_1;
    return __generator(this, function (_f) {
        switch (_f.label) {
            case 0:
                _f.trys.push([0, 10, , 11]);
                // Log the start of the analysis
                logger_1.default.info("Starting analysis of repository: ".concat(repoUrl));
                return [4 /*yield*/, (0, url_parse_1.parseURL)(repoUrl)];
            case 1:
                _a = _f.sent(), owner = _a[0], repo = _a[1];
                if (!owner || !repo) {
                    logger_1.default.info("Invalid URL or unsupported repository format.");
                    return [2 /*return*/];
                }
                apiUrl = "https://api.github.com/repos/".concat(owner, "/").concat(repo);
                // Log the GitHub API request
                logger_1.default.debug("Fetching repository data from GitHub for ".concat(owner, "/").concat(repo));
                return [4 /*yield*/, axios_1.default.get(apiUrl)];
            case 2:
                repoData = _f.sent();
                repoInfo = repoData.data;
                // Fetching contributors, issues, and commits data
                logger_1.default.debug("Fetching contributors, issues, and commits for ".concat(owner, "/").concat(repo));
                return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/contributors"))];
            case 3:
                contributorsData = _f.sent();
                return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/issues"))];
            case 4:
                issuesData = _f.sent();
                return [4 /*yield*/, axios_1.default.get("".concat(apiUrl, "/commits"))];
            case 5:
                commitsData = _f.sent();
                contributors = contributorsData.data;
                issues = issuesData.data;
                commits = commitsData.data;
                // Metric calculations:
                // Call getBusFactor to get the bus factor score and latency
                logger_1.default.debug("Calculating Bus Factor for ".concat(owner, "/").concat(repo));
                return [4 /*yield*/, (0, bus_factor_1.getBusFactor)(owner, repo)];
            case 6:
                _b = _f.sent(), busFactor = _b[0], busFactorLatency = _b[1];
                // Call getCorrectness to get the correctness score and latency
                logger_1.default.debug("Calculating Correctness for ".concat(owner, "/").concat(repo));
                return [4 /*yield*/, (0, correctness_1.getCorrectness)(owner, repo)];
            case 7:
                _c = _f.sent(), correctness = _c[0], correctnessLatency = _c[1];
                // Ramp-Up 
                logger_1.default.debug("Calculating Ramp-Up Time for ".concat(owner, "/").concat(repo));
                rampUp = (0, ramp_up_metric_1.calculateTotalTimeFromRepo)("https://github.com/".concat(owner, "/").concat(repo));
                rampUpLatency = 0;
                // Responsive Maintainer
                logger_1.default.debug("Calculating Responsive Maintainer Score for ".concat(owner, "/").concat(repo));
                return [4 /*yield*/, (0, responsive_maintainer_1.getResponsive)(owner, repo)];
            case 8:
                _d = _f.sent(), responsiveMaintainer = _d[0], responsiveMaintainerLatency = _d[1];
                // License Compatibility
                logger_1.default.debug("Checking License Compatibility for ".concat(owner, "/").concat(repo));
                return [4 /*yield*/, (0, license_1.getLicense)(owner, repo)];
            case 9:
                _e = _f.sent(), license = _e[0], licenseLatency = _e[1];
                // Calculate NetScore using all metrics
                logger_1.default.debug("Calculating NetScore for ".concat(owner, "/").concat(repo));
                netScore = calculateNetScore(busFactor, correctness, rampUp, responsiveMaintainer, license);
                // Log completion of the analysis
                logger_1.default.info("Analysis completed for repository: ".concat(repoUrl));
                result = {
                    URL: repoUrl,
                    NetScore: netScore.toFixed(2),
                    NetScore_Latency: 0, // Placeholder for overall latency calculation
                    RampUp: rampUp.toFixed(2),
                    RampUp_Latency: rampUpLatency.toFixed(3),
                    Correctness: correctness.toFixed(2),
                    Correctness_Latency: correctnessLatency.toFixed(3),
                    BusFactor: busFactor.toFixed(2),
                    BusFactor_Latency: busFactorLatency.toFixed(3),
                    ResponsiveMaintainer: responsiveMaintainer.toFixed(2),
                    ResponsiveMaintainer_Latency: responsiveMaintainerLatency.toFixed(3),
                    License: license === 1 ? "Pass" : "Fail",
                    License_Latency: licenseLatency.toFixed(3)
                };
                // Output result to stdout
                console.log(JSON.stringify(result));
                return [3 /*break*/, 11];
            case 10:
                error_1 = _f.sent();
                // Log the error
                logger_1.default.info("Failed to analyze repository: ".concat(repoUrl, ". Error: ").concat(error_1.message));
                return [3 /*break*/, 11];
            case 11: return [2 /*return*/];
        }
    });
}); };
// NetScore Calculation
var calculateNetScore = function (busFactor, correctness, rampUp, responsiveMaintainer, license) {
    return ((0.3 * busFactor) + (0.25 * correctness) + (0.25 * rampUp) + (0.2 * responsiveMaintainer)) * license;
};
// Command-line arguments handling
var args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Please provide a repository URL as an argument, or enter interactive mode.");
    console.log("Example: ./cli analyze <repository-url>");
    startInteractiveMode();
}
else {
    var command = args[0];
    if (command === 'analyze' && args[1]) {
        var repoUrl = args[1];
        analyzeRepository(repoUrl);
    }
    else {
        console.log("Invalid command or missing repository URL. Use './cli analyze <repository-url>' or run interactively.");
        process.exit(1);
    }
}
// Interactive mode for reading user input
function startInteractiveMode() {
    cl.question('Enter the repository URL to analyze: ', function (input) {
        if (input) {
            analyzeRepository(input);
        }
        else {
            console.log("No repository URL provided.");
        }
        cl.close();
    });
}
