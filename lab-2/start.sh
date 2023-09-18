#!/bin/bash
gcloud storage cp $1 - | ffmpeg -i pipe:0 -f mp3 pipe:1 | gcloud storage cp - $2 --content-type=audio/mp3
