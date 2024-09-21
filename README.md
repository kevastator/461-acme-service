# CLI Module Reliable Use Tool
## Purpose
The purpose of this project is to have a reliable tool to read a list of open source GitHub npm modules and produce a score based on 5 different metrics.
## Configuration
For smooth operation, make sure to set the environment variables GITHUB_TOKEN (equal to your github token for api calls), LOG_LEVEL (equal to 0-2 for silent, info, and debug verbosities), and LOG_FILE (path to the logfile you want to be produced).
## Use
This tool can run in 3 different ways: ./run install (installs needed dependencies), ./run <URL_FILE> (runs the tool using a file with module), ./run test (runs a test suite to test the integrity of the software and exits zero if everything is properly working).
