"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseURL = parseURL;
async function parseURL(url) {
    var _a;
    let splitStr = url.split("/");
    let gitIdx = splitStr.indexOf("github.com");
    if (gitIdx > -1) // We have a github url, easy parsing
     {
        return [splitStr[gitIdx + 1], splitStr[gitIdx + 2]]; // return owner and repo name
    }
    else // We have a non github url, so maybe npm?
     {
        let npmIdx = splitStr.indexOf("www.npmjs.com");
        if (npmIdx > -1) {
            // get the package name on npm from the link
            let packageName = splitStr[npmIdx + 2];
            let repoUrl = "";
            // make a fetch call to the npm registry and extract the json response
            const response = await fetch(`https://registry.npmjs.org/${packageName}`);
            const data = await response.json();
            // get the hosting url for the repository
            repoUrl = (_a = data === null || data === void 0 ? void 0 : data.repository) === null || _a === void 0 ? void 0 : _a.url;
            // split the new repo url
            splitStr = repoUrl.split("/");
            // check if any index of splitStr contains github.com (some cases where there is no perfect github.com)
            for (let i = 0; i < splitStr.length; i++) {
                if (splitStr[i].includes("github.com")) {
                    gitIdx = i;
                }
            }
            // just like a github link check to see if the index exists
            if (gitIdx > -1) // NPM link hosts github
             {
                return [splitStr[gitIdx + 1], splitStr[gitIdx + 2].replace(".git", "")]; // return owner and repo name with removed .git
            }
        }
        return ["", ""]; // ERROR INVALID LINK
    }
}
