#! /bin/bash
set -e
if [ $(uname) = Darwin ]; then
    brew install gtk+ libgnomecanvas expat
elif [ -f /etc/lsb-release ]; then
    sudo apt update
    sudo apt install -y libgnomecanvas2-dev libexpat1-dev libgtk2.0-dev
else
    echo not supported yet
    exit 1
fi
#opam install -y depext
#opam depext -y lablgtk conf-gnomecanvas dune
opam install -y lablgtk conf-gnomecanvas dune
