#!/bin/bash
cp src/*.html src/*.css LICENSE_TINYMUSIC dist/
rollup -c > dist/bundle.js
