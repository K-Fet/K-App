#!/usr/bin/env bash
#==============================================================================
#TITLE:            release.sh
#DESCRIPTION:      Script to release a new version using yarn.
#AUTHOR:           Marc-Antoine Fernandes
#DATE:             2018-04-26
#VERSION:          0.1
#USAGE:            ./release.sh <version>

#==============================================================================
# CUSTOM SETTINGS
#==============================================================================

URL="https://github.com/K-Fet/K-App/releases/new"

#==============================================================================
# METHODS
#==============================================================================

#==============================================================================
# RUN SCRIPT
#==============================================================================

# Set current directory to here
cd "${0%/*}"
cd ..

# Load error handler
source 'tools/lib/lib.trap.sh'


# Launch a new version
yarn version --new-version "$1"

git push --follow-tags

printf "New version released !\n"

# Open the github release page
[[ -x $BROWSER ]] && exec "$BROWSER" "$URL"
path=$(which xdg-open || which gnome-open) && exec "$path" "$URL"
echo "Go to $URL to release a new Github Version"
exit 0
