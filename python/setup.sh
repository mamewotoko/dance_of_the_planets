#! /bin/sh

if [ $(uname) = Darwin ]; then
    brew install python3
    # pip install PIL
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y python3 python3-pip
else
    echo not yet
fi

python3 -m pip install Pillow
