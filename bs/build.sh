#! /bin/sh
npm run build && $(npm bin)/browserify -t babelify src/dance.bs.js -o js/dance.js
