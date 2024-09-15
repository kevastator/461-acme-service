import * as readline from 'readline';

// reading strings

const cl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// read string function
const handleInput = (input: string) => {
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