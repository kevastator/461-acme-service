"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseURL = parseURL;
function parseURL(url) {
    let splitStr = url.split("/");
    let gitIdx = splitStr.indexOf("github.com");
    if (gitIdx > -1) // We have a github url, easy parsing
     {
        return [splitStr[gitIdx + 1], splitStr[gitIdx + 2]]; // return owner and repo name
    }
    else // We have a non github url, so maybe npm?
     {
        let npmIdx = splitStr.indexOf("www.npmjs.com");
        return ["", ""];
    }
}
