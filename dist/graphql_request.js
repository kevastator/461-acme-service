"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.graphqlRequest = graphqlRequest;
const config_env_1 = __importDefault(require("./config_env"));
async function graphqlRequest(query) {
    // We fetch using post method
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: { "Authorization": "bearer " + config_env_1.default.GITHUB_TOKEN }, // add our github token from env
        body: JSON.stringify({ query: query }) // stringify JSON query
    });
    // Get our response
    const { data, errors } = await response.json();
    if (response.ok) {
        if (errors == undefined) {
            return data;
        }
        else {
            return Promise.reject(errors);
        }
    }
    else {
        return Promise.reject("Error failed to get a response from the API");
    }
}
// EXAMPLE REQUEST (type query in raw string):
graphqlRequest(`
query {
    viewer { login }
    }
`).then((data) => sayName(data)); // use this notation to pass the data after the data is retrieved
function sayName(data) {
    var _a;
    console.log((_a = data === null || data === void 0 ? void 0 : data.viewer) === null || _a === void 0 ? void 0 : _a.login); // accessing properties in example function
}
