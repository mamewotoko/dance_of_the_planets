#! /bin/bash

if [ $(uname) = Darwin ]; then
    brew install nodejs make
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y nodejs make
else
    echo not yet
fi
npm install
