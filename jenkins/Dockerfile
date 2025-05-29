FROM jenkins/jenkins:lts-jdk21

USER root

# Install Docker CLI + curl
RUN apt-get update && \
    apt-get install -y docker.io curl && \
    rm -rf /var/lib/apt/lists/*

# Install Docker Compose V2 plugin
RUN mkdir -p /usr/libexec/docker/cli-plugins && \
    curl -SL "https://github.com/docker/compose/releases/download/v2.35.1/docker-compose-linux-x86_64" \
      -o /usr/libexec/docker/cli-plugins/docker-compose && \
    chmod +x /usr/libexec/docker/cli-plugins/docker-compose

# Install required Jenkins plugins
COPY plugins.txt /usr/share/jenkins/ref/plugins.txt
RUN jenkins-plugin-cli --plugin-file /usr/share/jenkins/ref/plugins.txt

USER jenkins

