//Code Update
import * as readline from 'readline'; // reading strings
import axios from 'axios'; // For fetching data from GitHub or npm
import logger from './logger';  // Import the logger
import { parseURL } from './url_parse'; //parsing github and npm urls
import { getBusFactor } from './bus_factor'; //imports metric for calculating bus factor
import { getCorrectness } from './correctness';  // imports metric for calculating correctness
import { calculateTotalTimeFromRepo } from './ramp_up_metric'; // imports metric for calculating correctness
import { getResponsive } from './responsive_maintainer'; // imports metric for calculating responsive maintainance
import { getLicense } from './license'; // imports metric for determining license compatibility

// Create a readline interface for interactive input
const cl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Placeholder function to analyze the repository
const analyzeRepository = async (repoUrl: string) => {
    try {
        // Log the start of the analysis
        logger.info(`Starting analysis of repository: ${repoUrl}`);

        // Parse the URL using the urlParser to get the owner and repo name
        const [owner, repo] = await parseURL(repoUrl);

        if (!owner || !repo) {
            logger.info("Invalid URL or unsupported repository format.");
            return;
        }

        // Construct the GitHub API URL using the parsed owner and repo name
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

        // Log the GitHub API request
        logger.debug(`Fetching repository data from GitHub for ${owner}/${repo}`);
        const repoData = await axios.get(apiUrl);
        const repoInfo = repoData.data;

        // Fetching contributors, issues, and commits data
        logger.debug(`Fetching contributors, issues, and commits for ${owner}/${repo}`);
        const contributorsData = await axios.get(`${apiUrl}/contributors`);
        const issuesData = await axios.get(`${apiUrl}/issues`);
        const commitsData = await axios.get(`${apiUrl}/commits`);

        const contributors = contributorsData.data;
        const issues = issuesData.data;
        const commits = commitsData.data;

        // Metric calculations:
        // Call getBusFactor to get the bus factor score and latency
        logger.debug(`Calculating Bus Factor for ${owner}/${repo}`);
        const [busFactor, busFactorLatency] = await getBusFactor(owner, repo);

        // Call getCorrectness to get the correctness score and latency
        logger.debug(`Calculating Correctness for ${owner}/${repo}`);
        const [correctness, correctnessLatency] = await getCorrectness(owner, repo);

        // Ramp-Up 
        logger.debug(`Calculating Ramp-Up Time for ${owner}/${repo}`);
        const rampUp = calculateTotalTimeFromRepo(`https://github.com/${owner}/${repo}`);
        const rampUpLatency = 0; // Placeholder if no latency is calculated

        // Responsive Maintainer
        logger.debug(`Calculating Responsive Maintainer Score for ${owner}/${repo}`);
        const [responsiveMaintainer, responsiveMaintainerLatency] = await getResponsive(owner, repo);

        // License Compatibility
        logger.debug(`Checking License Compatibility for ${owner}/${repo}`);
        const [license, licenseLatency] = await getLicense(owner, repo);

        // Calculate NetScore using all metrics
        logger.debug(`Calculating NetScore for ${owner}/${repo}`);
        const netScore = calculateNetScore(busFactor, correctness, rampUp, responsiveMaintainer, license);

        // Log completion of the analysis
        logger.info(`Analysis completed for repository: ${repoUrl}`);

        // Output the result in JSON format (for NDJSON)
        const result = {
            URL: repoUrl,
            NetScore: netScore.toFixed(2),
            NetScore_Latency: 0,  // Placeholder for overall latency calculation
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

    } catch (error) {
        // Log the error
        if (error instanceof Error) {
            logger.info(`Failed to analyze repository: ${repoUrl}. Error: ${error.message}`);
        } else {
            logger.info(`Failed to analyze repository: ${repoUrl}. An unknown error occurred.`);
        }  
    }
};

// NetScore Calculation
const calculateNetScore = (busFactor: number, correctness: number, rampUp: number, responsiveMaintainer: number, license: number): number => {
    return ((0.3 * busFactor) + (0.25 * correctness) + (0.25 * rampUp) + (0.2 * responsiveMaintainer)) * license;
};

// Command-line arguments handling
const args = process.argv.slice(2);

if (args.length === 0) {
    console.log("Please provide a repository URL as an argument, or enter interactive mode.");
    console.log("Example: ./cli analyze <repository-url>");
    startInteractiveMode();
} else {
    const command = args[0];

    if (command === 'analyze' && args[1]) {
        const repoUrl = args[1];
        analyzeRepository(repoUrl);
    } else {
        console.log("Invalid command or missing repository URL. Use './cli analyze <repository-url>' or run interactively.");
        process.exit(1);
    }
}

// Interactive mode for reading user input
function startInteractiveMode() {
    cl.question('Enter the repository URL to analyze: ', (input: string) => {
        if (input) {
            analyzeRepository(input);
        } else {
            console.log("No repository URL provided.");
        }
        cl.close();
    });
}