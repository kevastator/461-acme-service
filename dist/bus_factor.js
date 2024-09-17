"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBusFactor = getBusFactor;
const graphql_request_1 = require("./graphql_request");
const logger_1 = __importDefault(require("./logger"));
async function getBusFactor(owner, repoName) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // record the start time
    var start = new Date().getTime();
    // Graph QL query designed by Peter
    const query = `
    query {
    repository(owner: "${owner}", name: "${repoName}") {
        defaultBranchRef {
        target {
            ... on Commit {
            history(first: 100) {
                edges {
                node {
                    author {
                    user {
                        login
                    }
                    }
                    additions
                    deletions
                }
                }
            }
            }
        }
        }
    }
    }
    `;
    // use async call to get the graph ql response
    logger_1.default.debug("Calling GraphQL for Bus Factor");
    var response = await (0, graphql_request_1.graphqlRequest)(query);
    // Edges will return an array of the last 100 issues with contributer labels
    var edges = (_e = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.defaultBranchRef) === null || _c === void 0 ? void 0 : _c.target) === null || _d === void 0 ? void 0 : _d.history) === null || _e === void 0 ? void 0 : _e.edges;
    // initialize object
    var dict = {};
    // max number of unique commits is 1
    var max = 1;
    logger_1.default.debug("Looping for Bus Factor calculations...");
    // go through each commit, check the name, incriment count based on name
    for (var i = 0; i < edges.length; i++) {
        var userName = (_j = (_h = (_g = (_f = edges[i]) === null || _f === void 0 ? void 0 : _f.node) === null || _g === void 0 ? void 0 : _g.author) === null || _h === void 0 ? void 0 : _h.user) === null || _j === void 0 ? void 0 : _j.login;
        if (userName in dict) {
            dict[userName]++;
            // set max if this is a new max
            if (dict[userName] > max) {
                max = dict[userName];
            }
        }
        else {
            // initialize the key
            dict[userName] = 1;
        }
    }
    // Adjusted the formula, graph it out, it's better than the one we had
    var score = 1 - 1.02 * Math.pow((0.01 - (max / 100)), 2);
    // get the elapsed time in seconds (divide by 1000)
    var elapsed_time = (new Date().getTime() - start) / 1000;
    logger_1.default.infoDebug(`Successfully calculated Bus Factor of ${score} for ${owner}/${repoName} in ${elapsed_time}s`);
    return [score, elapsed_time];
}
getBusFactor("expressjs", "express");
getBusFactor("cloudinary", "cloudinary_npm");
getBusFactor("lodash", "lodash");
getBusFactor("nullivex", "nodist");
