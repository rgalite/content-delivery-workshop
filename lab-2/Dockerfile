FROM debian:buster-slim
RUN apt update -y && apt install -y ffmpeg
COPY ./start.sh /encode
RUN chmod +x /encode
ENTRYPOINT ["/encode"]
