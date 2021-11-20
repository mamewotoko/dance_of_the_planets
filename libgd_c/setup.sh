#! /bin/bash
UNAME=$(uname)
if [ "$UNAME" == "Darwin" ]; then
    brew install libgd
fi
