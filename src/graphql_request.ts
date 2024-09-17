import config from "./config_env";

export async function graphqlRequest(query: string)
{
    // We fetch using post method
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST", 
        headers: {"Authorization": "bearer " + config.GITHUB_TOKEN}, // add our github token from env
        body: JSON.stringify({query: query}) // stringify JSON query
    });

    // Get our response
    const responseJson = await response.json();

    const errors = responseJson?.errors;

    if (response.ok)
    {
        // Return the data if there is no error
        if (errors == undefined)
        {
            return responseJson;
        }
        else // if there is an error reject the request with the errors
        {
            return Promise.reject(errors);
        }
    }
    else
    {
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