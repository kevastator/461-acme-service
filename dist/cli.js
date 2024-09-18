"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require("readline");
// reading strings
var cl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// read string function
var handleInput = function (input) {
    console.log("ok understood. you said : ".concat(input, " correct?"));
    cl.question('You can enter more text below: ', handleInput);
};
cl.question('type something: ', handleInput);


// for inouting command line arguements
/*
const args = process.argv.slice(2)

if(args.length == 0){
    console.log("no arguements found");
}

args.forEach((arg, index) => {
    console.log(`Arguement ${index + 1}: ${arg}`);
});

*/ 
