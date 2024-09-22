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
        const latency = endTime - startTime; // Calculate latency in milliseconds

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
