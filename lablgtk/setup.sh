#! /bin/bash
if [ $(uname) = Darwin ]; then
    brew install make pkg-config
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y make
else
    echo not yet
fi
