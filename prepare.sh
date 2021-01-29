#!/bin/bash

cd web
npm install
gulp
rm -rf node_modules
cd -