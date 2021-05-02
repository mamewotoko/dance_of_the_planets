#! /bin/sh
if [ $(uname) = Darwin ]; then
    # brew install make cask
    brew install xorgproto
    brew install xquartz --cask
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y x11-app
else
    echo not yet
fi
