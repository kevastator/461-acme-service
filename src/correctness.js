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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
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
exports.getCorrectness = getCorrectness;
var graphql_request_1 = require("./graphql_request");
var logger_1 = require("./logger");
function getCorrectness(owner, repoName) {
    return __awaiter(this, void 0, void 0, function () {
        var start, query, response, edges, dict, i, state, score, elapsed_time;
        var _a, _b, _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    start = new Date().getTime();
                    query = "\n    query {\n    search(query: \"repo:".concat(owner, "/").concat(repoName, " label:bug\", type: ISSUE,  last:100) {\n        edges {\n        node {\n            ... on Issue {\n            state\n            }\n        }\n        }\n    }\n    }\n    ");
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
                    return [4 /*yield*/, (0, graphql_request_1.graphqlRequest)(query)];
                case 1:
                    response = _e.sent();
                    edges = (_b = (_a = response === null || response === void 0 ? void 0 : response.data) === null || _a === void 0 ? void 0 : _a.search) === null || _b === void 0 ? void 0 : _b.edges;
                    dict = {
                        "OPEN": 0,
                        "CLOSED": 0
                    };
                    logger_1.default.debug("Looping for Correctness calculations...");
                    // Check state of each bug
                    for (i = 0; i < edges.length; i++) {
                        state = (_d = (_c = edges[i]) === null || _c === void 0 ? void 0 : _c.node) === null || _d === void 0 ? void 0 : _d.state;
                        dict[state] += 1;
                    }
                    score = 0;
                    if ((dict["CLOSED"] + dict["OPEN"]) > 0) {
                        score = dict["CLOSED"] / (dict["OPEN"] + dict["CLOSED"]);
                    }
                    elapsed_time = (new Date().getTime() - start) / 1000;
                    logger_1.default.infoDebug("Successfully calculated Correctness of ".concat(score, " for ").concat(owner, "/").concat(repoName, " in ").concat(elapsed_time, "s"));
                    return [2 /*return*/, [score, elapsed_time]];
            }
        });
    });
}
getCorrectness("expressjs", "express");
getCorrectness("cloudinary", "cloudinary_npm");
getCorrectness("lodash", "lodash");
getCorrectness("nullivex", "nodist");
getCorrectness("kevastator", "461-acme-service");
