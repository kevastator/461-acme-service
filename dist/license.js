"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLicense = getLicense;
const graphql_request_1 = require("./graphql_request");
const logger_1 = __importDefault(require("./logger"));
async function getLicense(owner, repoName) {
    var _a, _b, _c;
    // record the start time
    var start = new Date().getTime();
    // Graph QL query designed by Peter
    const query = `
    query{
    repository(owner: "${owner}", name: "${repoName}") {
        licenseInfo {
        key
        }
    }
    }
    `;
    // use async call to get the graph ql response
    logger_1.default.debug("Calling GraphQL for License");
    var response = await (0, graphql_request_1.graphqlRequest)(query);
    // returns license name
    var licenseName = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.licenseInfo) === null || _c === void 0 ? void 0 : _c.key.toUpperCase();
    // Assume we fail the test for now
    var score = 0;
    // Pass Fail Basis includes the MIT license 
    if (licenseName != undefined && (licenseName.includes("MIT") || licenseName.includes("LGPL-2.1") || licenseName.includes("BSD-3-Clause"))) {
        score = 1;
    }
    // get the elapsed time in seconds (divide by 1000)
    var elapsed_time = (new Date().getTime() - start) / 1000;
    logger_1.default.infoDebug(`Successfully calculated License Metric of ${score} for ${owner}/${repoName} in ${elapsed_time}s`);
    return [score, elapsed_time];
}
getLicense("expressjs", "express");
getLicense("cloudinary", "cloudinary_npm");
getLicense("lodash", "lodash");
getLicense("nullivex", "nodist");
