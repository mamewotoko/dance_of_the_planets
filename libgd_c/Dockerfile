FROM ubuntu:20.04

ENV DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get install -y -qq gcc make libgd-dev
RUN mkdir /work
VOLUME /work
