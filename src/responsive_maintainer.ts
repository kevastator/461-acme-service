import { graphqlRequest } from "./graphql_request";
import logger from "./logger";

export async function getResponsive(owner: string, repoName: string): Promise<number[]> {
    // Record the start time
    var start: number = new Date().getTime();

    // GraphQL query to get commit timestamps and issues/PRs
    const query = `
    query {
        repository(owner: "${owner}", name: "${repoName}") {
            defaultBranchRef {
                target {
                    ... on Commit {
                        history(first: 100) {
                            edges {
                                node {
                                    committedDate
                                }
                            }
                        }
                    }
                }
            }
            issues(states: [OPEN, CLOSED], first: 100) {
                totalCount
            }
            pullRequests(states: [OPEN, CLOSED], first: 100) {
                totalCount
            }
        }
    }
    `;

    // Use async call to get the GraphQL response
    logger.debug("Calling GraphQL for commit timestamps and issues/PRs");
    var response = await graphqlRequest(query);

    // Extract edges containing commit information
    var edges = response?.data?.repository?.defaultBranchRef?.target?.history?.edges;
    var issuesCount = response?.data?.repository?.issues?.totalCount || 0;
    var prsCount = response?.data?.repository?.pullRequests?.totalCount || 0;

    // Total issues and PRs
    var totalIssuesOrPRs = issuesCount + prsCount;

    // lower limit
    if (!edges || edges.length < 2 || totalIssuesOrPRs === 0) {
        logger.debug("Not enough commit data or no issues/PRs to calculate average time between commits");
        return [0, 0];  // Return 0 if there's not enough data
    }

    // Convert commit dates to timestamps and store in an array
    var commitTimestamps: number[] = [];
    for (var i = 0; i < edges.length; i++) {
        var committedDate: string = edges[i]?.node?.committedDate;
        if (committedDate) {
            commitTimestamps.push(new Date(committedDate).getTime());
        }
    }

    // Sort timestamps in ascending order
    commitTimestamps.sort((a, b) => a - b);

    // Calculate differences between consecutive commits
    var timeDifferences: number[] = [];
    for (var i = 1; i < commitTimestamps.length; i++) {
        var timeDiff = (commitTimestamps[i] - commitTimestamps[i - 1]) / 1000; // in seconds
        timeDifferences.push(timeDiff);
    }

    // Calculate average time difference in seconds
    var totalDiff = timeDifferences.reduce((acc, val) => acc + val, 0);
    var avgTimeBetweenCommitsInSeconds = totalDiff / timeDifferences.length;

    // Convert average time difference to hours
    var avgTimeBetweenCommitsInHours = avgTimeBetweenCommitsInSeconds / 3600; // 1 hour = 3600 seconds

    // Check if avg hours is greater than 100
    // upper limit
    if (avgTimeBetweenCommitsInHours > 100) {
        return [0, 0];
    }

    // Calculate the metric (response time per issue/PR)
    var metric = avgTimeBetweenCommitsInHours / totalIssuesOrPRs;

    // Get the elapsed time in seconds (divide by 1000)
    var elapsed_time: number = (new Date().getTime() - start) / 1000;

    logger.infoDebug(`Successfully calculated average time between commits: ${avgTimeBetweenCommitsInHours.toFixed(2)} hours for ${owner}/${repoName} in ${elapsed_time}s`);

    return [metric, elapsed_time];
}

//getResponsive("expressjs", "express");
