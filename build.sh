#!/bin/bash
#
# A helper script for the VegaDNS2 Dockerfile

set -e

# Change to the directory of this script
DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
cd ${DIR}/

npm install
npm run-script build
