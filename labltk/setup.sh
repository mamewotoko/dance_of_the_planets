#! /bin/sh
if [ $(uname) = Darwin ]; then
    brew install make pkg-config expat
    brew install xquartz --cask
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y make tk-dev tcl-dev
else
    echo not yet
fi
opam install -y labltk dune
