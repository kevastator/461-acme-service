import config from "./config_env";

async function graphqlRequest(query: string)
{
    console.log(config.GITHUB_TOKEN);

    const response = await fetch("https://api.github.com/graphql", 
        {method: "POST", headers: {"Authorization": "bearer" + config.GITHUB_TOKEN}, body: `{viewer {login}}`});
    const data = await response.json();
    console.log(data);
}

graphqlRequest("TEST");