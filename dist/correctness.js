"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCorrectness = getCorrectness;
const graphql_request_1 = require("./graphql_request");
const logger_1 = __importDefault(require("./logger"));
async function getCorrectness(owner, repoName) {
    var _a, _b, _c, _d;
    // record the start time
    var start = new Date().getTime();
    // Graph QL query
    const query = `
    query {
    search(query: "repo:${owner}/${repoName} label:bug", type: ISSUE,  last:100) {
        edges {
        node {
            ... on Issue {
            state
            }
        }
        }
    }
    }
    `;
    /*
    const closeQuery = `
    query {
    search(query: "repo:${owner}/${repoName} label:bug state:closed", type: ISSUE) {
        edges {
        node {
            ... on Issue {
            title
            url
            createdAt
            author {
                login
            }
            }
        }
        }
    }
    }
    `
    */
    // Calling Open and Closed queries
    logger_1.default.debug("Calling GraphQL for Correctness");
    var response = await (0, graphql_request_1.graphqlRequest)(query);
    var edges = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.edges; // Check if this is correct
    var dict = {
        "OPEN": 0,
        "CLOSED": 0
    };
    logger_1.default.debug("Looping for Correctness calculations...");
    // Check state of each bug
    for (var i = 0; i < edges.length; i++) {
        var state = (_d = (_c = edges[i]) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.state;
        dict[state] += 1;
    }
    // Calculate the correctness
    var score = dict["CLOSED"] / (dict["OPEN"] + dict["CLOSED"]);
    // get the elapsed time in seconds (divide by 1000)
    var elapsed_time = (new Date().getTime() - start) / 1000;
    logger_1.default.infoDebug(`Successfully calculated Correctness of ${score} for ${owner}/${repoName} in ${elapsed_time}s`);
    return [score, elapsed_time];
}
getCorrectness("expressjs", "express");
getCorrectness("cloudinary", "cloudinary_npm");
getCorrectness("lodash", "lodash");
getCorrectness("nullivex", "nodist");
getCorrectness("kevastator", "461-acme-service");
