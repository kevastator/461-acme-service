"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const child_process_1 = require("child_process");
// Function to run shell commands and capture the output
function runCommand(command) {
    try {
        return (0, child_process_1.execSync)(command).toString().trim();
    }
    catch (error) {
        console.error("Error executing command:", error);
        return '';
    }
}
// Function to calculate normalized time based on halstead metrics
function calculateRampUpTime(directory) {
    // Navigate to node_modules/halstead-metrics-cli directory
    process.chdir('node_modules/halstead-metrics-cli');
    // Get the output from halstead-metrics-cli
    const halsteadOutput = runCommand(`npx halstead dir ../../${directory}`);
    // Extract the time required to program in hours from the output
    const timeMatch = halsteadOutput.match(/Time required to program \(h\).*[\d.\d]/);
    if (!timeMatch) {
        console.error("Unable to find the time in halstead-metrics-cli output");
        return 0;
    }
    else {
        const timeMatchStr = timeMatch[0];
        const timeStr = timeMatchStr.match(/\d+.\d+/);
        if (!timeStr) {
            console.error("Unable to parse time from halstead-metrics-cli output");
            return 0;
        }
        else {
            const time = parseFloat(timeStr[0]);
            const TIME_LIMIT = 100; // Time limit in hours
            // Check if the time exceeds the limit
            if (time > TIME_LIMIT) {
                return 0;
            }
            else {
                // Normalize the time
                const normalizedTime = 1 - time / TIME_LIMIT;
                return normalizedTime;
            }
        }
    }
}
// Main function to run the ramp up time calculation
function main(directory) {
    const result = calculateRampUpTime(directory);
    // Navigate back to the root directory
    process.chdir('../../');
    return result;
}
