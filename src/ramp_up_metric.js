"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateTotalTimeFromRepo = calculateTotalTimeFromRepo;
var fs = require("fs");
var path = require("path");
var child_process_1 = require("child_process"); // To execute git commands
var acorn_1 = require("acorn");
var acorn_walk_1 = require("acorn-walk");
// Function to clone a GitHub repository into a directory
function cloneGitHubRepo(url, targetDir) {
    // Clone the repository into the target directory with depth 1 to only get the latest commit
    (0, child_process_1.execSync)("git clone --depth 1 ".concat(url, " ").concat(targetDir), { stdio: 'inherit' });
}
// Function to delete a directory recursively
function deleteDirectoryRecursive(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach(function (file) {
            var currentPath = path.join(dirPath, file);
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
    var operatorsSet = new Set();
    var operandsSet = new Set();
    var N1 = 0; // Total operators count
    var N2 = 0; // Total operands count
    var ast = (0, acorn_1.parse)(content, { ecmaVersion: 'latest' });
    (0, acorn_walk_1.simple)(ast, {
        // Operators (arithmetic, logical, assignment, etc.)
        BinaryExpression: function (node) {
            operatorsSet.add(node.operator);
            N1++; // Counting operators
        },
        UnaryExpression: function (node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        LogicalExpression: function (node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        AssignmentExpression: function (node) {
            operatorsSet.add(node.operator);
            N1++;
        },
        // Operands (identifiers, literals)
        Identifier: function (node) {
            operandsSet.add(node.name);
            N2++; // Counting operands
        },
        Literal: function (node) {
            operandsSet.add(String(node.value));
            N2++;
        }
    });
    return {
        eta1: operatorsSet.size, // Number of distinct operators
        eta2: operandsSet.size, // Number of distinct operands
        N1: N1, // Total number of operators
        N2: N2 // Total number of operands
    };
}
function calculateTimeToProgram(metrics) {
    var eta1 = metrics.eta1, eta2 = metrics.eta2, N1 = metrics.N1, N2 = metrics.N2;
    // Program vocabulary: η = η1 + η2
    var eta = eta1 + eta2;
    // Program length: N = N1 + N2
    var N = N1 + N2;
    // Calculated estimated program length: N^ = η1 * log2(η1) + η2 * log2(η2)
    var estimatedN = eta1 * Math.log2(eta1 || 1) + eta2 * Math.log2(eta2 || 1);
    // Volume: V = N * log2(η)
    var volume = N * Math.log2(eta || 1);
    // Difficulty: D = (η1 / 2) * (N2 / η2)
    var difficulty = (eta1 / 2) * (N2 / (eta2 || 1));
    // Effort: E = D * V
    var effort = difficulty * volume;
    // Time to program: T = E / (18 * 3600) (in hours)
    var timeToProgram = effort / (18 * 3600);
    return timeToProgram;
}
function getJavaScriptFiles(dir) {
    var files = [];
    fs.readdirSync(dir).forEach(function (file) {
        var filePath = path.join(dir, file);
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
    var targetDir = 'analyze_repo';
    var time_max = 100; // Locally defined time_max
    // Step 1: Clone the GitHub repository into 'analyze_repo'
    try {
        console.log("Cloning repository from ".concat(gitHubUrl, " into ").concat(targetDir, "..."));
        cloneGitHubRepo(gitHubUrl, targetDir);
        // Step 2: Perform the metric calculations
        var jsFiles = getJavaScriptFiles(targetDir);
        var totalTime_1 = 0;
        jsFiles.forEach(function (filePath) {
            var content = fs.readFileSync(filePath, 'utf-8');
            var metrics = calculateMetrics(content);
            var time = calculateTimeToProgram(metrics);
            totalTime_1 += time;
        });
        // Step 3: Clean up by deleting the cloned repository
        console.log("Cleaning up the cloned repository at ".concat(targetDir, "..."));
        deleteDirectoryRecursive(targetDir);
        // Step 4: Return the result based on totalTime
        if (totalTime_1 > time_max) {
            return 0;
        }
        else {
            return 1 - totalTime_1 / time_max;
        }
    }
    catch (error) {
        console.error('An error occurred:', error);
        deleteDirectoryRecursive(targetDir); // Ensure cleanup even if an error occurs
        throw error;
    }
}
