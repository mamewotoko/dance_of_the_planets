#! /bin/bash
set -e
if [ $(uname) = Darwin ]; then
    PKG_CONFIG_PATH=/usr/local/lib/pkgconfig brew install gtk+3 pango pkg-config
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y cargo pkg-config libgtk-3-dev
else
    echo not supported yet
    exit 1
fi
