#!/bin/bash
set -euxo pipefail
gcloud storage cp $1 - | ffmpeg -hide_banner -loglevel warning -i pipe:0 -f mp3 pipe:1 | gcloud storage cp - $2 --content-type=audio/mp3
