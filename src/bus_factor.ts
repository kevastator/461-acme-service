import { graphqlRequest } from "./graphql_request";
import logger from "./logger";

export async function getBusFactor(owner: string, repoName: string): Promise<number[]>
{
    // record the start time
    var start:number = new Date().getTime();

    // Graph QL query designed by Peter
    const query = `
    query {
    repository(owner: "${owner}", name: "${repoName}") {
        defaultBranchRef {
        target {
            ... on Commit {
            history(first: 100) {
                edges {
                node {
                    author {
                    user {
                        login
                    }
                    }
                }
                }
            }
            }
        }
        }
    }
    }
    `

    // use async call to get the graph ql response
    logger.debug("Calling GraphQL for Bus Factor");
    var response = await graphqlRequest(query);

    // Edges will return an array of the last 100 issues with contributer labels
    var edges = response?.data?.repository?.defaultBranchRef?.target?.history?.edges;

    // Create a temporary dict interface for string keys
    interface Dictonary {
        [key: string]: number;
    }

    // initialize object
    var dict:Dictonary = {};

    // max number of unique commits is 1
    var max:number = 1;
    
    logger.debug("Looping for Bus Factor calculations...");
    // go through each commit, check the name, incriment count based on name
    for (var i = 0; i < edges.length; i++)
    {
        var userName: string = edges[i]?.node?.author?.user?.login;

        if (userName in dict)
        {
            dict[userName]++;

            // set max if this is a new max
            if (dict[userName] > max)
            {
                max = dict[userName];
            }
        }
        else
        {
            // initialize the key
            dict[userName] = 1;
        }
    }

    // Adjusted the formula, graph it out, it's better than the one we had
    var score: number = 1 - 1.02 * Math.pow((0.01 - (max / 100)), 2);

    // get the elapsed time in seconds (divide by 1000)
    var elapsed_time:number = (new Date().getTime() - start) / 1000;

    logger.infoDebug(`Successfully calculated Bus Factor of ${score} for ${owner}/${repoName} in ${elapsed_time}s`);

    return [score, elapsed_time];
}

getBusFactor("expressjs", "express");
getBusFactor("cloudinary", "cloudinary_npm");
getBusFactor("lodash", "lodash");
getBusFactor("nullivex", "nodist");