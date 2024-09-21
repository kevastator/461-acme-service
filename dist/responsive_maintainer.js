"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponsive = getResponsive;
const graphql_request_1 = require("./graphql_request");
const logger_1 = __importDefault(require("./logger"));
async function getResponsive(owner, repoName) {
    var _a, _b, _c, _d, _e, _f, _g;
    // Record the start time
    var start = new Date().getTime();
    // GraphQL query to get commit timestamps
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
        }
    }
    `;
    // Use async call to get the GraphQL response
    logger_1.default.debug("Calling GraphQL for commit timestamps");
    var response = await (0, graphql_request_1.graphqlRequest)(query);
    // Extract edges containing commit information
    var edges = (_e = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.defaultBranchRef) === null || _c === void 0 ? void 0 : _c.target) === null || _d === void 0 ? void 0 : _d.history) === null || _e === void 0 ? void 0 : _e.edges;
    if (!edges || edges.length < 2) {
        logger_1.default.debug("Not enough commit data to calculate average time between commits");
        return 0; // Return 0 if there's not enough data
    }
    // Convert commit dates to timestamps and store in an array
    var commitTimestamps = [];
    for (var i = 0; i < edges.length; i++) {
        var committedDate = (_g = (_f = edges[i]) === null || _f === void 0 ? void 0 : _f.node) === null || _g === void 0 ? void 0 : _g.committedDate;
        if (committedDate) {
            commitTimestamps.push(new Date(committedDate).getTime());
        }
    }
    // Sort timestamps in ascending order
    commitTimestamps.sort((a, b) => a - b);
    // Calculate differences between consecutive commits
    var timeDifferences = [];
    for (var i = 1; i < commitTimestamps.length; i++) {
        var timeDiff = (commitTimestamps[i] - commitTimestamps[i - 1]) / 1000; // in seconds
        timeDifferences.push(timeDiff);
    }
    // Calculate average time difference in seconds
    var totalDiff = timeDifferences.reduce((acc, val) => acc + val, 0);
    var avgTimeBetweenCommitsInSeconds = totalDiff / timeDifferences.length;
    // Convert average time difference to hours
    var avgTimeBetweenCommitsInHours = avgTimeBetweenCommitsInSeconds / 3600; // 1 hour = 3600 seconds
    // Get the elapsed time in seconds (divide by 1000)
    var elapsed_time = (new Date().getTime() - start) / 1000;
    logger_1.default.infoDebug(`Successfully calculated average time between commits: ${avgTimeBetweenCommitsInHours.toFixed(2)} hours for ${owner}/${repoName} in ${elapsed_time}s`);
    console.log(avgTimeBetweenCommitsInHours);
    return avgTimeBetweenCommitsInHours;
}
getResponsive("expressjs", "express");
