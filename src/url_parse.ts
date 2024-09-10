export function parseURL(url: string): [string, string]
{
    let splitStr: string[] = url.split("/");
    let gitIdx: number = splitStr.indexOf("github.com");

    if (gitIdx > -1) // We have a github url, easy parsing
    {
        return [splitStr[gitIdx + 1], splitStr[gitIdx + 2]]; // return owner and repo name
    }
    else // We have a non github url, so maybe npm?
    {
        let npmIdx: number = splitStr.indexOf("www.npmjs.com");

        return ["", ""];
    }
}