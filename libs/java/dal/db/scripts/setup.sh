#!/bin/bash

# This fixes a bug with GPG when signing the package.
# export GPG_TTY=$(tty)
# export MAVEN_OPTS="--add-opens=java.base/java.util=ALL-UNNAMED --add-opens=java.base/java.lang.reflect=ALL-UNNAMED --add-opens=java.base/java.text=ALL-UNNAMED --add-opens=java.desktop/java.awt.font=ALL-UNNAMED"

# Import the private.key that is in the root folder.
# This is required to sign and verify packages.
# sudo env "PATH=$PATH" gpg --import private.key
sudo gpg --import private.key