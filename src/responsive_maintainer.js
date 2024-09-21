"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getResponsive = getResponsive;
var graphql_request_1 = require("./graphql_request");
var logger_1 = require("./logger");
function getResponsive(owner, repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var start, query, response, edges, commitTimestamps, i, committedDate, timeDifferences, i, timeDiff, totalDiff, avgTimeBetweenCommitsInSeconds, avgTimeBetweenCommitsInHours, elapsed_time;
        var _a, _b, _c, _d, _e, _f, _g;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    start = new Date().getTime();
                    query = "\n    query {\n        repository(owner: \"".concat(owner, "\", name: \"").concat(repoName, "\") {\n            defaultBranchRef {\n                target {\n                    ... on Commit {\n                        history(first: 100) {\n                            edges {\n                                node {\n                                    committedDate\n                                }\n                            }\n                        }\n                    }\n                }\n            }\n        }\n    }\n    ");
                    // Use async call to get the GraphQL response
                    logger_1.default.debug("Calling GraphQL for commit timestamps");
                    return [4 /*yield*/, (0, graphql_request_1.graphqlRequest)(query)];
                case 1:
                    response = _h.sent();
                    edges = (_e = (_d = (_c = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.repository) === null || _b === void 0 ? void 0 : _b.defaultBranchRef) === null || _c === void 0 ? void 0 : _c.target) === null || _d === void 0 ? void 0 : _d.history) === null || _e === void 0 ? void 0 : _e.edges;
                    if (!edges || edges.length < 2) {
                        logger_1.default.debug("Not enough commit data to calculate average time between commits");
                        return [2 /*return*/, 0]; // Return 0 if there's not enough data
                    }
                    commitTimestamps = [];
                    for (i = 0; i < edges.length; i++) {
                        committedDate = (_g = (_f = edges[i]) === null || _f === void 0 ? void 0 : _f.node) === null || _g === void 0 ? void 0 : _g.committedDate;
                        if (committedDate) {
                            commitTimestamps.push(new Date(committedDate).getTime());
                        }
                    }
                    // Sort timestamps in ascending order
                    commitTimestamps.sort(function (a, b) { return a - b; });
                    timeDifferences = [];
                    for (i = 1; i < commitTimestamps.length; i++) {
                        timeDiff = (commitTimestamps[i] - commitTimestamps[i - 1]) / 1000;
                        timeDifferences.push(timeDiff);
                    }
                    totalDiff = timeDifferences.reduce(function (acc, val) { return acc + val; }, 0);
                    avgTimeBetweenCommitsInSeconds = totalDiff / timeDifferences.length;
                    avgTimeBetweenCommitsInHours = avgTimeBetweenCommitsInSeconds / 3600;
                    elapsed_time = (new Date().getTime() - start) / 1000;
                    logger_1.default.infoDebug("Successfully calculated average time between commits: ".concat(avgTimeBetweenCommitsInHours.toFixed(2), " hours for ").concat(owner, "/").concat(repoName, " in ").concat(elapsed_time, "s"));
                    console.log(avgTimeBetweenCommitsInHours);
                    return [2 /*return*/, avgTimeBetweenCommitsInHours];
            }
        });
    });
}
getResponsive("expressjs", "express");
