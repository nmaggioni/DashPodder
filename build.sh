#!/bin/bash

echo -e "### Setting up environment..."

set -e

# shellcheck disable=SC2034
NODE_ENV=production

PACKAGE_MANAGER="yarn"
set +e
if ! command -v yarn &>/dev/null; then
  PACKAGE_MANAGER="npm"
fi
set -e

echo -e "### Building frontend...\n"

(
    cd client
    $PACKAGE_MANAGER install
    $PACKAGE_MANAGER run build
)

echo -e "\n### Cleaning backend...\n"

if [ -f server/constants/bin/gpo ]; then
    rm server/constants/bin/gpo
fi

echo -e "\n### Building backend...\n"

(
    cd server
    $PACKAGE_MANAGER install --production
)

echo -e "\n### Parsing repo status..."

set +e

GIT_TAG="$(git tag -l --points-at HEAD | head -1)"
GIT_COMMIT="$(git rev-parse HEAD | cut -c 1-7)"
GIT_REF=$GIT_TAG
if [[ $GIT_REF == "" ]]; then
  GIT_REF="$GIT_COMMIT"
fi
GIT_DIRTY=""
if ! git diff-index --quiet HEAD; then
  GIT_DIRTY="_dirty"
fi

set -e

echo -e "### Bundling assets..."

ARCHIVE_NAME="./dashpodder_${GIT_REF}${GIT_DIRTY}.tar.gz"
tar -czf "$ARCHIVE_NAME" --transform 's/^\.\//dashpodder\//' ./client/dist ./server

echo -e "\n### Assets archived in: ${ARCHIVE_NAME} !"
