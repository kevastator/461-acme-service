import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import Decimal from 'decimal.js';

// Function to read commit data from a file
function readCommitData(filepath: string): [string[], string[]] {
    const data = fs.readFileSync(filepath, 'utf8');
    const lines = data.split('\n');
    const dates: string[] = [];
    const timeStamps: string[] = [];

    for(const line of lines){
        const parts = line.trim().split(' ');
        if(parts.length >= 3){
            const cleanDates = parts[1].replace(/\x00/g, '').trim();
            const cleanTime = parts[2].replace(/\x00/g, '').trim();
            dates.push(cleanDates);
            timeStamps.push(cleanTime);
        }
    }

    return [dates, timeStamps]

}

const [dates, times] = readCommitData('commits.txt');
//console.log('Dates:', dates);
//console.log('Times:', times);

function calculateTimeDifferences(dates: string[], times: string[]): number[] {
    const timeDifferences: number[] = [];
  
    for (let i = 1; i < dates.length; i++) {
        const previousDateTime = new Date(`${dates[i - 1]}T${times[i - 1]}`);
        const currentDateTime = new Date(`${dates[i]}T${times[i]}`);
      
        const diffMilliseconds = currentDateTime.getTime() - previousDateTime.getTime();
      
        const diffMinutes = Math.floor(diffMilliseconds / 1000 / 60);
        timeDifferences.push(Math.abs(diffMinutes)); // in minutes
    }
  
    return timeDifferences;
}
  
const differences = calculateTimeDifferences(dates, times);
//console.log(differences);

function calculateAverageTime(differences: number[]): number {
    if(differences.length === 0){
        return 0;
    }

    let totalTime: number = 0;
    let averageTime: number = 0;

    for(let i = 1; i < differences.length; i++){
        totalTime += (differences[i] / 60) // calculates in hours
    }

    averageTime = totalTime / differences.length;

    return averageTime;
}

const avgTime = calculateAverageTime(differences);
console.log(`${avgTime} hours`);
