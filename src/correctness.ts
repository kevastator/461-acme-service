import { graphqlRequest } from "./graphql_request";
import logger from "./logger";

export async function getCorrectness(owner: string, repoName: string): Promise<number[]>
{
    // record the start time
    var start:number = new Date().getTime();

    // Graph QL query
    const query = `
    query {
    search(query: "repo:${owner}/${repoName} label:bug", type: ISSUE,  last:100) {
        edges {
        node {
            ... on Issue {
            state
            }
        }
        }
    }
    }
    `
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
    logger.debug("Calling GraphQL for Correctness");
    var response = await graphqlRequest(query);

    var edges = response?.data?.search?.edges; // Check if this is correct

    // Create a dictionary with open and closed as the 2 keys
    interface Dictonary {
        [key: string]: number;
    }

    var dict:Dictonary = {
        "OPEN": 0,
        "CLOSED": 0
    };  

    logger.debug("Looping for Correctness calculations...");

    // Check state of each bug
    for (var i = 0; i < edges.length; i++) {
        var state: string = edges[i]?.node?.state;
        dict[state] += 1;
    }

    // Calculate the correctness
    var score = 0;
    if ((dict["CLOSED"] + dict["OPEN"]) > 0) {
        score = dict["CLOSED"] / (dict["OPEN"] + dict["CLOSED"]);
    }

    // get the elapsed time in seconds (divide by 1000)
    var elapsed_time:number = (new Date().getTime() - start) / 1000;

    logger.infoDebug(`Successfully calculated Correctness of ${score} for ${owner}/${repoName} in ${elapsed_time}s`);

    return [score, elapsed_time];
}

getCorrectness("expressjs", "express");
getCorrectness("cloudinary", "cloudinary_npm");
getCorrectness("lodash", "lodash");
getCorrectness("nullivex", "nodist");
getCorrectness("kevastator", "461-acme-service");
