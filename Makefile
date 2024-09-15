# Variable for the I/O directories
OUTDIR := dist
SRCDIR := src

# Rule to compile/run the TypeScript file
build-%:
	@ echo "Building $*..."
	@ npx tsc

run-%:
	@ echo "Running $*..."
	@ node $(OUTDIR)/$(basename $*).js

# Clean rule to remove the output directory
clean:
ifeq ($(OS), Windows_NT)
	@ rmdir /S $(OUTDIR)
else
	@ rm -r $(OUTDIR)
endif

# Calculates the Ramp-Up Metric
# Explanation of code :
# The command changes directories to the halstead metric directory.
# It then runs the healstead metric calculator, which outputs a table of metrics.
# It parses through the table and obtains the "time to code (hours)" number
# It checks if that number is larger than TIME_LIMIT (if true it outputs 0)
# Otherwise it divides the time to code by the TIME_LIMIT and outputs that
# TLDR : You can change TIME_LIMIT to set where a guaranteed 0 is
ramp_up:
	@ cd node_modules/halstead-metrics-cli && \
		TIME=$$(npx halstead dir ../../dist | grep "Time required to program (h)" | sed 's/.*(h).............//') && \
		TIME_LIMIT=10 && \
		if [ $$(echo "$$TIME > $$TIME_LIMIT" | bc) -eq 1 ]; then \
			echo 0; \
		else \
			NORMALIZED_TIME=$$(awk "BEGIN {print 1 - $$TIME / $$TIME_LIMIT}") && \
			echo $$NORMALIZED_TIME; \
		fi && \
		cd ../../

install:
	@ npm install --save-dev
# Special rule to handle compiling and running a specified file
%:
	@ $(MAKE) -s build-$*
	@ $(MAKE) -s run-$*

.PHONY: clean install ramp_up

# //////////////////////////////////
#     HOW TO USE THE MAKEFILE
# //////////////////////////////////
# "node" and "tsc" commands need to be downloaded in order for this makefile to work!!
# NOTE : Assume the desired TypeScript file is called test.ts for the following:
#
# Compile TypeScript file (compiled file -> dist folder)
#    make build-test.ts
# Run compiled TypeScript file
#    make run-test.ts
# Compile and Run TypeScript file (file extension isn't needed... make test works)
#    make test.ts
# Remove all compiled TypeScript files (USE CAREFULLY)
#    make clean
# Install all dependencies
#    make install
# Calculate the Ramp-Up Metric (for all compiled files in dist)
#    make ramp_up
