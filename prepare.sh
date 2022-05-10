#!/bin/bash

cd web
npm install
npm install -g gulp
gulp
rm -rf node_modules
cd -