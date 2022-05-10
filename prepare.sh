#!/bin/bash

cd web
echo "Running npm install"
npm install
echo "Installing gulp"
npm install -g gulp
echo "Running gulp"
gulp
echo "Removing node_modules"
rm -rf node_modules
cd -