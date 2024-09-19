import { graphqlRequest } from "./graphql_request";
import logger from "./logger";

export async function getLicense(owner: string, repoName: string): Promise<number[]>
{
    // record the start time
    var start:number = new Date().getTime();

    // Graph QL query designed by Peter
    const query = `
    query{
    repository(owner: "${owner}", name: "${repoName}") {
        licenseInfo {
        key
        }
    }
    }
    `

    // use async call to get the graph ql response
    logger.debug("Calling GraphQL for License");
    var response = await graphqlRequest(query);

    // returns license key
    var licenseName: string = response?.data?.repository?.licenseInfo?.key.toUpperCase();

    // Assume we fail the test for now
    var score: number = 0;

    // Pass Fail Basis includes the MIT license, new BSD, and LGPL-2.1 itself
    if (licenseName != undefined && (licenseName.includes("MIT") || licenseName.includes("LGPL-2.1") || licenseName.includes("BSD-3-Clause")))
    {
        score = 1;
    }
    else // If license is undefined or something else search through the markdown file
    {
        logger.debug(`No Clear GraphQL License found for ${owner}/${repoName}, searching the markdown`);
        // Get the markdown file from the repo master branch
        var responseMd = await fetch(`https://raw.githubusercontent.com/${owner}/${repoName}/master/README.md`);

        // If it is not ok assume it does not exist and return zero and the latency
        if (!responseMd.ok)
        {
            var elapsed_time:number = (new Date().getTime() - start) / 1000;

            logger.debug(`No README for alternative license could be found on the web for ${owner}/${repoName}!`);

            return [score, elapsed_time];
        }

        // Else we extract the markdown file
        var markdown: string = await responseMd.text();

        // Split based on license header
        var searchArr: string[] = markdown.split("# License");
        var searchString: string = "";

        // If the header is found (the split array is bigger than 1) set the search string
        if (searchArr.length > 1)
        {
            searchString = searchArr[1].split("##")[0];
        }

        // If the search string has any license indications, set the score to 1!
        if ((searchString.includes("MIT") || searchString.includes("LGPL-2.1") || searchString.includes("BSD-3-Clause")))
        {
            score = 1;
        }
    }

    // get the elapsed time in seconds (divide by 1000)
    var elapsed_time:number = (new Date().getTime() - start) / 1000;

    logger.infoDebug(`Successfully calculated License Metric of ${score} for ${owner}/${repoName} in ${elapsed_time}s`);

    return [score, elapsed_time];
}

getLicense("expressjs", "express");
getLicense("cloudinary", "cloudinary_npm");
getLicense("lodash", "lodash");
getLicense("nullivex", "nodist");