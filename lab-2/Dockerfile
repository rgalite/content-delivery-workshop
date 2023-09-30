FROM debian:buster-slim

# Install gcloud https://cloud.google.com/sdk/docs/install#deb
RUN apt-get update -y && apt-get install apt-transport-https ca-certificates gnupg curl -y
RUN echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] http://packages.cloud.google.com/apt cloud-sdk main" | tee -a /etc/apt/sources.list.d/google-cloud-sdk.list && curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | apt-key --keyring /usr/share/keyrings/cloud.google.gpg  add -

RUN apt-get update -y && apt-get install -y ffmpeg google-cloud-cli

COPY ./start.sh /encoder
RUN chmod +x /encoder

WORKDIR /app

ENTRYPOINT ["/encoder"]
