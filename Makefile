# Variable for the output directory
OUTDIR := ./js_out

# Rule to compile/run the TypeScript file
build-%:
  tsc --rootDir ./ --outDir $(OUTDIR) $*

run-%:
  node $(OUTDIR)/$(basename $*).js

# Clean rule to remove the output directory
clean:
  rm -rf $(OUTDIR)

# Special rule to handle compiling and running a specified file
%:
  $(MAKE) build-$*
  $(MAKE) run-$*

# //////////////////////////////////
#     HOW TO USE THE MAKEFILE
# //////////////////////////////////
# "node" and "tsc" commands need to be downloaded in order for this makefile to work!!
# NOTE : Assume the desired TypeScript file is called test.ts for the following:
#
# 1. Changing "js_out" in the OUTDIR variable declaration will create a folder inside the working
#    directory with the name given to OUTDIR. This will be the folder that contains all of the compiled
#    TypeScript files.
# 2. Typing "make build-test.ts" will create a compiled TypeScript file (now Javascript) and place that
#    in the specified folder (declared in 1).
# 3. Typing "make run-test.ts" (make run-test.js and make run-test will ALSO work) will simply run the
#    compiled JavaScript file in the compiled file folder (this ONLY works if the corresponding TypeScript
#    file was compiled FIRST).
# 4. To make things easy typing "make test" will compile the test.ts file AND run the corresponding compiled
#    file.
