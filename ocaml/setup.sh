#! /bin/bash
set -e
if [ $(uname) = Darwin ]; then
    # brew install make cask
    # brew install xorgproto
    # brew install xquartz --cask
    echo nothing to do
elif [ -f /etc/lsb-release ]; then
    sudo apt-get update
    sudo apt-get install -y x11-apps
else
    echo not yet
    exit 1
fi

# TODO: for CI
# opam option depext-run-installs=false
opam install -y odoc graphics dune
