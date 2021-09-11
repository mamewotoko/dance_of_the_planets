#! /bin/bash
if [ $(uname) = Darwin ]; then
    brew install gtk+ libgnomecanvas expat
elif [ -f /etc/lsb-release ]; then
    sudo apt update
    sudo apt install -y gtk2.0 libgnomecanvas2-dev
else
    echo not supported yet
fi
#opam install -y depext
#opam depext -y lablgtk conf-gnomecanvas dune
opam install -y lablgtk conf-gnomecanvas dune
