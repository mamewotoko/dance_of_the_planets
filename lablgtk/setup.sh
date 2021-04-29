#! /bin/bash
if [ $(uname) = Darwin ]; then
    brew install pkg-config
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y make libexpat1-dev libgnomecanvas2-dev libgtk2.0-dev
else
    echo not yet
fi
