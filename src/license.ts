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

    // get the elapsed time in seconds (divide by 1000)
    var elapsed_time:number = (new Date().getTime() - start) / 1000;

    logger.infoDebug(`Successfully calculated License Metric of ${score} for ${owner}/${repoName} in ${elapsed_time}s`);

    return [score, elapsed_time];
}

getLicense("expressjs", "express");
getLicense("cloudinary", "cloudinary_npm");
getLicense("lodash", "lodash");
getLicense("nullivex", "nodist");