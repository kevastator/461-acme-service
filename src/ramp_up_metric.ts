import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';  // To execute git commands
import { parse } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import logger from './logger';

/*
This general setup should work for implementation in CLI

import { calculateTotalTimeFromRepo } from './ramp_up_metric';  // Import the function from this file

const gitHubUrl = 'https://github.com/some-user/some-repo.git';  // Create some GitHub url

try {                                                             // Run the metric
    const result = calculateTotalTimeFromRepo(gitHubUrl);
} catch (error) {
}
*/

interface HalsteadMetrics {
    eta1: number; // Number of distinct operators
    eta2: number; // Number of distinct operands
    N1: number;   // Total number of operators
    N2: number;   // Total number of operands
}

// Function to clone a GitHub repository into a directory
export function cloneGitHubRepo(url: string, targetDir: string): void {
    // Clone the repository into the target directory with depth 1 to only get the latest commit
    execSync(`git clone --depth 1 ${url} ${targetDir}`, { stdio: 'inherit' });
}

// Function to delete a directory recursively
export function deleteDirectoryRecursive(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
        fs.readdirSync(dirPath).forEach((file) => {
            const currentPath = path.join(dirPath, file);
            if (fs.lstatSync(currentPath).isDirectory()) {
                // Recursively delete sub-directories
                deleteDirectoryRecursive(currentPath);
            } else {
                // Delete file
                fs.unlinkSync(currentPath);
            }
        });
        fs.rmdirSync(dirPath);
    }
}

// Operators and operands tracking
export function calculateMetrics(content: string): HalsteadMetrics {
    const operatorsSet = new Set<string>();
    const operandsSet = new Set<string>();
    let N1 = 0; // Total operators count
    let N2 = 0; // Total operands count

    const ast = parse(content, { ecmaVersion: 'latest' });

    walkSimple(ast, {
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
        eta2: operandsSet.size,  // Number of distinct operands
        N1,                      // Total number of operators
        N2                       // Total number of operands
    };
}

export function calculateTimeToProgram(metrics: HalsteadMetrics): number {
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

export function getJavaScriptFiles(dir: string): string[] {
    let files: string[] = [];

    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            files = files.concat(getJavaScriptFiles(filePath));
        } else if (filePath.endsWith('.js')) {
            files.push(filePath);
        }
    });

    return files;
}

// Main function that calculates the normalized time and returns the appropriate result
export function calculateTotalTimeFromRepo(gitHubUrl: string): [number, number] {
    const targetDir = 'analyze_repo';
    const time_max = 100;  // Locally defined time_max

    // Step 1: Clone the GitHub repository into 'analyze_repo'
    const startTime = performance.now(); // Start time for latency measurement
    try {
        logger.debug(`Cloning repository from ${gitHubUrl} into ${targetDir}...`);
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
        logger.debug(`Cleaning up the cloned repository at ${targetDir}...`);
        deleteDirectoryRecursive(targetDir);

        // Step 4: Measure end time and calculate latency
        const endTime = performance.now(); // End time for latency measurement
        const latency = (endTime - startTime) / 1000; // Calculate latency in seconds

        // Step 5: Return the result based on totalTime and latency
        if (totalTime > time_max) {
            return [0, latency];
        } else {
            return [1 - totalTime / time_max, latency];
        }

    } catch (error) {
        logger.infoDebug('An error occurred!');
        deleteDirectoryRecursive(targetDir);  // Ensure cleanup even if an error occurs
        throw error;
    }
}
