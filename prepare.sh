#!/bin/bash

cd web
echo "Running npm install"
npm install
echo "Running build"
npm run build
cd -