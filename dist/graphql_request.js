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
    const responseJson = await response.json();
    const errors = responseJson === null || responseJson === void 0 ? void 0 : responseJson.errors;
    if (response.ok) {
        // Return the data if there is no error
        if (errors == undefined) {
            return responseJson;
        }
        else // if there is an error reject the request with the errors
         {
            return Promise.reject(errors);
        }
    }
    else {
        // if the response is not okay reject it and say there was an error
        return Promise.reject("Error failed to get a response from the API");
    }
}
// EXAMPLE REQUEST (type query in raw string):
// graphqlRequest(`
// query {
//     viewer { login }
//     }
// `).then((data) => sayName(data)); // use this notation to pass the data after the data is retrieved
// function sayName(data: any)
// {
//     console.log(data?.viewer?.login); // accessing properties in example function
// }
