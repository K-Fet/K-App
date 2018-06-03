#!/usr/bin/env bash
#==============================================================================
#TITLE:            update.sh
#DESCRIPTION:      Script to update the git repository withe last release.
#AUTHOR:           Marc-Antoine Fernandes
#DATE:             2017-11-16
#VERSION:          0.1
#USAGE:            ./update.sh

#==============================================================================
# CUSTOM SETTINGS
#==============================================================================


#==============================================================================
# METHODS
#==============================================================================

function checkout_last_release() {
    # Get new tags from remote
    git fetch --tags

    # Get latest tag name
    latestTag=$(git describe --tags `git rev-list --tags --max-count=1`)

    # Checkout latest tag
    git checkout ${latestTag}
}

#==============================================================================
# RUN SCRIPT
#==============================================================================

# Set current directory to here
cd "${0%/*}"
cd ..

# Load error handler
source 'tools/lib/lib.trap.sh'

checkout_last_release

# Install or update dependencies
yarn run install:prod

# Build assets for client
yarn run build

# Migrate database schema
# In case of a failed migration, we do not stop the application because
# The database will still be working but will not handle new cases.
# Anyway, the error will be logged
yarn run migrate

# Restart all instance of the app
systemctl restart 'kapp@*'

printf "Server updated !\n\n"
exit 0
