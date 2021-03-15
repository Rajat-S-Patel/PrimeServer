#!/usr/bin/env node

const prompt=require('prompt-sync')({sigint:true});
const fn=require('./functions');
const chalk = require('chalk');

// displaying title string on console in prettier way
const title=chalk.yellowBright.bgBlue.bold("\n ------------------------Prime Generator------------------------- \n");
console.log(title);

// taking input from user
const range=prompt("Enter range:= ").split(" ");
// converting string to Number, and assigning it to start and end.
const start=Number(range[0]),end=Number(range[1]);

// Displaying the range [start,end] given by the user
const rangeMessage=chalk.greenBright("Given range is: ["+start+","+end+"]");
console.log(rangeMessage);

// Asking user to choose the algorithm
const menu= chalk.cyanBright('Select the algorithm:\n'+
'1. Naive Approach (suitable for numbers <=10^3)\n'+
'2. Sieve of Eratosthenes (suitable for numbers <=10^6)\n'+
'3. Segmented Sieve (suitable for large numbers upto 10^14 within range <=10^6\n');
console.log(menu);

const choice=prompt(chalk.whiteBright('Enter your choice:'));
// Executing appropriate function based on the users choice
try{
    var ans=null;
    switch(Number(choice))
    {
        case 1:
            ans=fn.naivePrimes(start,end);
            break;
        case 2:
            ans=fn.findPrimesSieve(start,end);
            break;
        case 3:
            ans=fn.segmentedSieve(start,end);
            break;
        default:
            console.log("Inappropriate choice");
    }
    if(ans!=null){
        console.log("Total primes: ",ans.length);
        // printing the result on the console
        console.log(ans);
    }
}
catch(err)
{
    // displaying the error message on the console
    const errmsg=chalk.redBright(err.message);
    console.log(errmsg);
}
