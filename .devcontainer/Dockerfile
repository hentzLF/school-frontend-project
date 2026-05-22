FROM mcr.microsoft.com/devcontainers/typescript-node:22-bookworm

RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    curl \
    wget \
    jq \
    tmux \
    less \
    nano \
    vim \
    procps \
    sudo \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

USER node
ENV NODE_OPTIONS="--max-old-space-size=4096"
WORKDIR /workspace
