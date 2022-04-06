#!/bin/bash

# To run this test through npm run, make sure Nacre is installed at system level
# Either npm or nvm tries to get Nacre at system level instead of using the default nvm.
# In a dev environment, you can `npm install --global .`

# exit immediately if a command return non zero value
set -e

which node

echo "Print node version"
node --version
echo ""

which nacre

echo "Print nacre help"
nacre --help
echo ""

echo "Print nacre version"
nacre --version
echo "\n"

pwd

nacre ./test/system/fixtures/main.js
