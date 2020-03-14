#! /bin/bash

if [ $(uname) = Darwin ]; then
    brew install sbt
elif [ -f /etc/lsb-release ]; then
    echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
    curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | sudo apt-key add
    sudo apt-get update
    cat /etc/lsb-release
    sudo apt search openjdk
    sudo apt install sbt openjdk-11-jdk
fi
