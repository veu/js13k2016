#!/bin/bash
cp src/*.html src/*.css dist/
rollup -c > dist/bundle.js
