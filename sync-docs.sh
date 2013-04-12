#!/bin/bash

cp -r ../karma/docs/* src/content/0.8/
cp ../karma/CHANGELOG.md src/content/0.8/about/01-changelog.md

git add src/content/0.8/**/*.md
git commit -m "Sync the docs"

grunt build
git add 0.8/**/*.html
git commit -m "Build"
