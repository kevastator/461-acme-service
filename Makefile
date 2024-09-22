# Variable for the I/O directories
OUTDIR := dist
SRCDIR := src
TESTDIR := tests

# Rule to compile/run the TypeScript file
build-%:
	@ echo "Building $*..."
	@ npx tsc

run-%:
	@ echo "Running $*..."
	@ node $(OUTDIR)/$(basename $*).js

run-tests:
	@ echo "Running tests..."
	@ npx jest $(TESTDIR)

# Clean rule to remove the output directory
clean:
ifeq ($(OS), Windows_NT)
	@ rmdir /S $(OUTDIR)
else
	@ rm -r $(OUTDIR)
endif

install:
	@ npm install --save-dev
	@ npm install --save-dev @types/node @types/jest

# Special rule to handle compiling and running a specified file
%:
	@ $(MAKE) -s build-$*
	@ $(MAKE) -s run-$*

.PHONY: clean install

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
