"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
// reading strings
const cl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
// read string function
const handleInput = (input) => {
    console.log(`ok understood. you said : ${input} correct?`);
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
