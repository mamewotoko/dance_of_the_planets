#! /bin/bash

if [ $(uname) = Darwin ]; then
    brew install sbt
elif [ -f /etc/lsb-release ]; then
    sudo apt-get install -y gnupg2 curl default-jre
    echo "deb https://repo.scala-sbt.org/scalasbt/debian /" | sudo tee /etc/apt/sources.list.d/sbt_old.list
    curl -sL "https://keyserver.ubuntu.com/pks/lookup?op=get&search=0x2EE0EA64E40A89B84B2DF73499E82A75642AC823" | APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=1 sudo apt-key add -
    sudo apt-get update
    sudo apt-get install -y sbt

    # echo "deb https://dl.bintray.com/sbt/debian /" | sudo tee -a /etc/apt/sources.list.d/sbt.list
    # sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 642AC823
    # sudo apt-get update
    # sudo apt-get install sbt openjdk-11-jdk
fi
