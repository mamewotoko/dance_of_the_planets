#! /bin/bash
if [ $(uname) = Darwin ]; then
    brew install pkg-config
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
else
    echo not yet
fi
