"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_env_1 = __importDefault(require("./config_env"));
async function graphqlRequest(query) {
    console.log(config_env_1.default.GITHUB_TOKEN);
    const response = await fetch("https://api.github.com/graphql", { method: "POST", headers: { "Authorization": "bearer" + config_env_1.default.GITHUB_TOKEN }, body: `{viewer {login}}` });
    const data = await response.json();
    console.log(data);
}
graphqlRequest("TEST");
