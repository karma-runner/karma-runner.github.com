#!/bin/bash

set -e

BRANCH="$1"
VERSION="$2"

if [ -z "$BRANCH" ]; then
  BRANCH="master"
fi

if [ -z "$VERSION" ]; then
  VERSION="5.0"
fi

KARMA_REPO="karma"
DOCS_REPO=$(cd "$(dirname "$0")"; pwd)

# get latest Karma repo and switch to requested branch or tag
if [ -d "$KARMA_REPO" ]; then
  echo "Fetching karma-runner/karma repository updates..."
  cd $KARMA_REPO
  git fetch
else
  echo "Cloning karma-runner/karma repository..."
  git clone https://github.com/karma-runner/karma.git
  cd $KARMA_REPO
fi
echo "Switching karma-runner/karma repository to $BRANCH..."
git checkout --detach $BRANCH
cd $DOCS_REPO

# copy the docs source
echo "Removing old docs..."
git rm -rf src/content/$VERSION
echo "Copying the docs from master repo..."
mkdir src/content/$VERSION
cp -r $KARMA_REPO/docs/* $DOCS_REPO/src/content/$VERSION/
echo "Copying the changelog..."
echo -e "editButton: false\n" > $DOCS_REPO/src/content/$VERSION/about/02-changelog.md
cat $KARMA_REPO/CHANGELOG.md >> $DOCS_REPO/src/content/$VERSION/about/02-changelog.md

# commit sync
cd $DOCS_REPO
git add src/content/$VERSION/**/*.md src/content/$VERSION/*.md
git commit -m "Sync the docs"

# build html and commit
./node_modules/.bin/grunt build
git add .
git commit -m "Build"
