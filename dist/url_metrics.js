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
const fs_1 = require("fs");
const child_process_1 = require("child_process");
const url_parse_1 = require("./url_parse"); // Assuming parseURL is in parse_url.ts
const path = __importStar(require("path"));
const ramp_up_metric_1 = require("./ramp_up_metric"); // Import ramp_up_metric
// Function to read URLs from the file
async function readUrlsFromFile(filepath) {
    const data = await fs_1.promises.readFile(filepath, 'utf8');
    return data.split('\n').filter(Boolean); // Remove any empty lines
}
// Function to clone repositories
function gitClone(owner, repo, directory) {
    return new Promise((resolve, reject) => {
        const cloneCmd = `git clone --depth=1 https://github.com/${owner}/${repo}.git ${directory}`;
        (0, child_process_1.exec)(cloneCmd, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve();
            }
        });
    });
}
// Function to run metrics on the cloned repository
async function runMetrics(repoDir) {
    try {
        // Run ramp-up metric calculation
        cleanDirectory(repoDir);
        const normalizedTime = (0, ramp_up_metric_1.main)(repoDir);
        return normalizedTime;
    }
    catch (error) {
        console.error("Error runnning ramp-up metric:", error);
        return 0;
    }
}
async function moveJsFiles(directory, targetDir) {
    try {
        const items = await fs_1.promises.readdir(directory);
        // Iterate over each item in the directory
        for (const item of items) {
            const itemPath = path.join(directory, item);
            const stats = await fs_1.promises.stat(itemPath);
            if (stats.isDirectory()) {
                // Recursively move .js files from subdirectories
                await moveJsFiles(itemPath, targetDir);
                // Remove the directory if it's empty after moving files
                try {
                    await fs_1.promises.rmdir(itemPath);
                }
                catch (err) {
                    // Ignore errors if the directory is not empty
                }
            }
            else if (stats.isFile()) {
                // Move .js files to the target directory
                if (item.endsWith('.js')) {
                    const targetPath = path.join(targetDir, item);
                    await fs_1.promises.rename(itemPath, targetPath);
                }
                else {
                    // Delete files that are not .js
                    await fs_1.promises.unlink(itemPath);
                }
            }
        }
    }
    catch (error) {
        console.error(`Error processing directory ${directory}:`, error);
    }
}
// Main function to clean the directory and move .js files
async function cleanDirectory(directory) {
    try {
        // Start moving .js files and cleaning directories
        await moveJsFiles(directory, directory);
        console.log(`Cleaned directory ${directory}, moved .js files to ${directory}`);
    }
    catch (error) {
        console.error(`Error cleaning directory ${directory}:`, error);
    }
}
async function removeDirectory(directory) {
    try {
        // Get a list of all items in the directory
        const items = await fs_1.promises.readdir(directory);
        // Iterate over each item
        for (const item of items) {
            const itemPath = path.join(directory, item);
            const stats = await fs_1.promises.stat(itemPath);
            if (stats.isDirectory()) {
                // Recursively remove subdirectories
                await removeDirectory(itemPath);
            }
            else if (stats.isFile()) {
                // Remove files
                await fs_1.promises.unlink(itemPath);
            }
        }
        // Remove the empty directory
        await fs_1.promises.rmdir(directory);
        console.log(`Removed directory: ${directory}`);
    }
    catch (error) {
        console.error(`Error removing directory ${directory}:`, error);
    }
}
async function main(urlFilePath) {
    const urls = await readUrlsFromFile(urlFilePath);
    const results = [];
    for (const url of urls) {
        try {
            const [owner, repo] = await (0, url_parse_1.parseURL)(url);
            if (owner && repo) {
                const repoDir = path.join('repo_metrics', `${owner}_${repo}`);
                // Clone the repository
                await gitClone(owner, repo, repoDir);
                // Run the metrics and capture the result
                const result = await runMetrics(repoDir);
                results.push(result);
                removeDirectory(repoDir);
            }
        }
        catch (error) {
            console.error(`Error processing URL ${url}:`, error);
        }
    }
    // Write results to an NDJSON file
    const ndjsonData = results.map(result => JSON.stringify(result)).join('\n');
    await fs_1.promises.writeFile('results.ndjson', ndjsonData, 'utf8');
    fs_1.promises.rm('./repo_metrics', { recursive: true });
}
// Start the process
const urlFilePath = process.argv[2];
if (urlFilePath) {
    main(urlFilePath).catch(err => console.error(err));
}
else {
    console.error('Please provide a URL file path');
}
