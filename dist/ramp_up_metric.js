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
exports.calculateTotalTime = calculateTotalTime;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const acorn_1 = require("acorn");
const acorn_walk_1 = require("acorn-walk");
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
    // Time to program: T = E / 18 (in seconds) -> 1 / 3600 (in hours)
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
function calculateTotalTime(directory) {
    const time_max = 100; // Locally defined time_max
    const jsFiles = getJavaScriptFiles(directory);
    let totalTime = 0;
    jsFiles.forEach(filePath => {
        const content = fs.readFileSync(filePath, 'utf-8');
        const metrics = calculateMetrics(content);
        const time = calculateTimeToProgram(metrics);
        totalTime += time;
    });
    // Return 0 if totalTime exceeds time_max, otherwise return 1 - (totalTime / time_max)
    if (totalTime > time_max) {
        return 0;
    }
    else {
        return 1 - totalTime / time_max;
    }
}
