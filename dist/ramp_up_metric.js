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
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalTimeFromRepo = calculateTotalTimeFromRepo;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const child_process_1 = require("child_process"); // To execute git commands
const acorn_1 = require("acorn");
const acorn_walk_1 = require("acorn-walk");
// Function to clone a GitHub repository into a directory
function cloneGitHubRepo(url, targetDir) {
    // Clone the repository into the target directory with depth 1 to only get the latest commit
    (0, child_process_1.execSync)(`git clone --depth 1 ${url} ${targetDir}`, { stdio: 'inherit' });
}
// Function to delete a directory recursively
function deleteDirectoryRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Recursively delete sub-directories
                deleteDirectoryRecursive(currentPath);
            }
            else {
                // Delete file
                fs.unlinkSync(currentPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}
// Operators and operands tracking
function calculateMetrics(content) {
    const operatorsSet = new Set();
    const operandsSet = new Set();
    let N1 = 0; // Total operators count
    let N2 = 0; // Total operands count
    const ast = (0, acorn_1.parse)(content, { ecmaVersion: 'latest' });
    (0, acorn_walk_1.simple)(ast, {
        // Operators (arithmetic, logical, assignment, etc.)
        BinaryExpression(node) {
            operatorsSet.add(node.operator);
            N1++; // Counting operators
        },
        UnaryExpression(node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        LogicalExpression(node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        AssignmentExpression(node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        // Operands (identifiers, literals)
        Identifier(node) {
            operandsSet.add(node.name);
            N2++; // Counting operands
        },
        Literal(node) {
            operandsSet.add(String(node.value));
            N2++;
        }
    });
    return {
        eta1: operatorsSet.size, // Number of distinct operators
        eta2: operandsSet.size, // Number of distinct operands
        N1, // Total number of operators
        N2 // Total number of operands
    };
}
function calculateTimeToProgram(metrics) {
    const { eta1, eta2, N1, N2 } = metrics;
    // Program vocabulary: η = η1 + η2
    const eta = eta1 + eta2;
    // Program length: N = N1 + N2
    const N = N1 + N2;
    // Calculated estimated program length: N^ = η1 * log2(η1) + η2 * log2(η2)
    const estimatedN = eta1 * Math.log2(eta1 || 1) + eta2 * Math.log2(eta2 || 1);
    // Volume: V = N * log2(η)
    const volume = N * Math.log2(eta || 1);
    // Difficulty: D = (η1 / 2) * (N2 / η2)
    const difficulty = (eta1 / 2) * (N2 / (eta2 || 1));
    // Effort: E = D * V
    const effort = difficulty * volume;
    // Time to program: T = E / (18 * 3600) (in hours)
    const timeToProgram = effort / (18 * 3600);
    return timeToProgram;
}
function getJavaScriptFiles(dir) {
    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            files = files.concat(getJavaScriptFiles(filePath));
        }
        else if (filePath.endsWith('.js')) {
            files.push(filePath);
        }
    });
    return files;
}
// Main function that calculates the normalized time and returns the appropriate result
function calculateTotalTimeFromRepo(gitHubUrl) {
    const targetDir = 'analyze_repo';
    const time_max = 100; // Locally defined time_max
    // Step 1: Clone the GitHub repository into 'analyze_repo'
    try {
        console.log(`Cloning repository from ${gitHubUrl} into ${targetDir}...`);
        cloneGitHubRepo(gitHubUrl, targetDir);
        // Step 2: Perform the metric calculations
        const jsFiles = getJavaScriptFiles(targetDir);
        let totalTime = 0;
        jsFiles.forEach(filePath => {
            const content = fs.readFileSync(filePath, 'utf-8');
            const metrics = calculateMetrics(content);
            const time = calculateTimeToProgram(metrics);
            totalTime += time;
        });
        // Step 3: Clean up by deleting the cloned repository
        console.log(`Cleaning up the cloned repository at ${targetDir}...`);
        deleteDirectoryRecursive(targetDir);
        console.log(totalTime);
        // Step 4: Return the result based on totalTime
        if (totalTime > time_max) {
            return 0;
        }
        else {
            return 1 - totalTime / time_max;
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
        deleteDirectoryRecursive(targetDir); // Ensure cleanup even if an error occurs
        throw error;
    }
}
const gitHubUrl = 'https://github.com/kevastator/461-acme-service.git';
try { // Run the metric
    const result = calculateTotalTimeFromRepo(gitHubUrl);
    console.log(`Calculated metric: ${result}`);
}
catch (error) {
    console.error('Failed to calculate metrics:', error);
}
