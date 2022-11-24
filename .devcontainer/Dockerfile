FROM nikolaik/python-nodejs:python3.7-nodejs18

ARG USERNAME=sam-user
ARG USER_UID=2000
ARG USER_GID=$USER_UID

# Update npm
RUN npm install -g npm
# Intall aws cli
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-aarch64.zip" -o "awscliv2.zip" && unzip awscliv2.zip && ./aws/install
# Install sam cli
RUN pip install aws-sam-cli
# Create the user
RUN groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USER_GID -m $USERNAME \
    && apt-get update \
    && apt-get install -y sudo \
    && echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

USER $USERNAME
ENV SHELL /bin/bash