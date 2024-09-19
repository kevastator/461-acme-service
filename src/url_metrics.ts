import { promises as fs } from 'fs';
import { exec } from 'child_process';
import { parseURL } from './url_parse'; // Assuming parseURL is in parse_url.ts
import * as path from 'path';
import { main as runRampUpMetric } from './ramp_up_metric'; // Import ramp_up_metric

// Function to read URLs from the file
async function readUrlsFromFile(filepath: string): Promise<string[]> {
    const data = await fs.readFile(filepath, 'utf8');
    return data.split('\n').filter(Boolean); // Remove any empty lines
}

// Function to clone repositories
function gitClone(owner: string, repo: string, directory: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const cloneCmd = `git clone --depth=1 https://github.com/${owner}/${repo}.git ${directory}`;
        exec(cloneCmd, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Function to run metrics on the cloned repository
async function runMetrics(repoDir: string): Promise<number> {
    try {
        // Run ramp-up metric calculation
        cleanDirectory(repoDir);
        const normalizedTime = runRampUpMetric(repoDir);
        return normalizedTime;
    } catch (error) {
        console.error("Error runnning ramp-up metric:", error);
        return 0;
    }
}

async function moveJsFiles(directory: string, targetDir: string): Promise<void> {
    try {
        const items = await fs.readdir(directory);

        // Iterate over each item in the directory
        for (const item of items) {
            const itemPath = path.join(directory, item);
            const stats = await fs.stat(itemPath);

            if (stats.isDirectory()) {
                // Recursively move .js files from subdirectories
                await moveJsFiles(itemPath, targetDir);
                
                // Remove the directory if it's empty after moving files
                try {
                    await fs.rmdir(itemPath);
                } catch (err) {
                    // Ignore errors if the directory is not empty
                }
            } else if (stats.isFile()) {
                // Move .js files to the target directory
                if (item.endsWith('.js')) {
                    const targetPath = path.join(targetDir, item);
                    await fs.rename(itemPath, targetPath);
                } else {
                    // Delete files that are not .js
                    await fs.unlink(itemPath);
                }
            }
        }
    } catch (error) {
        console.error(`Error processing directory ${directory}:`, error);
    }
}

// Main function to clean the directory and move .js files
async function cleanDirectory(directory: string): Promise<void> {
    try {
        // Start moving .js files and cleaning directories
        await moveJsFiles(directory, directory);

        console.log(`Cleaned directory ${directory}, moved .js files to ${directory}`);
    } catch (error) {
        console.error(`Error cleaning directory ${directory}:`, error);
    }
}

async function removeDirectory(directory: string): Promise<void> {
    try {
        // Get a list of all items in the directory
        const items = await fs.readdir(directory);

        // Iterate over each item
        for (const item of items) {
            const itemPath = path.join(directory, item);
            const stats = await fs.stat(itemPath);

            if (stats.isDirectory()) {
                // Recursively remove subdirectories
                await removeDirectory(itemPath);
            } else if (stats.isFile()) {
                // Remove files
                await fs.unlink(itemPath);
            }
        }

        // Remove the empty directory
        await fs.rmdir(directory);
        console.log(`Removed directory: ${directory}`);
    } catch (error) {
        console.error(`Error removing directory ${directory}:`, error);
    }
}

async function main(urlFilePath: string) {
    const urls = await readUrlsFromFile(urlFilePath);
    const results = [];

    for (const url of urls) {
        try {
            const [owner, repo] = await parseURL(url);
            if (owner && repo) {
                const repoDir = path.join('repo_metrics', `${owner}_${repo}`);

                // Clone the repository
                await gitClone(owner, repo, repoDir);
                // Run the metrics and capture the result
                const result = await runMetrics(repoDir);
                results.push(result);
                removeDirectory(repoDir);
            }
        } catch (error) {
            console.error(`Error processing URL ${url}:`, error);
        }
    }
    
    // Write results to an NDJSON file
    const ndjsonData = results.map(result => JSON.stringify(result)).join('\n');
    await fs.writeFile('results.ndjson', ndjsonData, 'utf8');
    fs.rm('./repo_metrics', {recursive: true})
}

// Start the process
const urlFilePath = process.argv[2];
if (urlFilePath) {
    main(urlFilePath).catch(err => console.error(err));
} else {
    console.error('Please provide a URL file path');
}