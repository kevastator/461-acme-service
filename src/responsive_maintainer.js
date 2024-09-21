"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
// Function to read commit data from a file
function readCommitData(filepath) {
    var data = fs.readFileSync(filepath, 'utf8');
    var lines = data.split('\n');
    var dates = [];
    var timeStamps = [];
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
        var line = lines_1[_i];
        var parts = line.trim().split(' ');
        if (parts.length >= 3) {
            var cleanDates = parts[1].replace(/\x00/g, '').trim();
            var cleanTime = parts[2].replace(/\x00/g, '').trim();
            dates.push(cleanDates);
            timeStamps.push(cleanTime);
        }
    }
    return [dates, timeStamps];
}
var _a = readCommitData('commits.txt'), dates = _a[0], times = _a[1];
//console.log('Dates:', dates);
//console.log('Times:', times);
function calculateTimeDifferences(dates, times) {
    var timeDifferences = [];
    for (var i = 1; i < dates.length; i++) {
        var previousDateTime = new Date("".concat(dates[i - 1], "T").concat(times[i - 1]));
        var currentDateTime = new Date("".concat(dates[i], "T").concat(times[i]));
        var diffMilliseconds = currentDateTime.getTime() - previousDateTime.getTime();
        var diffMinutes = Math.floor(diffMilliseconds / 1000 / 60);
        timeDifferences.push(Math.abs(diffMinutes)); // in minutes
    }
    return timeDifferences;
}
var differences = calculateTimeDifferences(dates, times);
//console.log(differences);
function calculateAverageTime(differences) {
    if (differences.length === 0) {
        return 0;
    }
    var totalTime = 0;
    var averageTime = 0;
    for (var i = 1; i < differences.length; i++) {
        totalTime += (differences[i] / 60); // calculates in hours
    }
    averageTime = totalTime / differences.length;
    return averageTime;
}
var avgTime = calculateAverageTime(differences);
console.log("".concat(avgTime, " hours"));
