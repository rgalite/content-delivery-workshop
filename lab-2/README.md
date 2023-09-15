# Introduction
In this lab, we'll create a job to process a file uploaded to a bucket and upload it to a second bucket.

## Streaming download
Use the documentation to [download](https://cloud.google.com/storage/docs/streaming-downloads#prereq-cli) the file and stream it to ffmeg [proceess](https://ffmpeg.org/ffmpeg-protocols.html#pipe)

```
gcloud storage cp gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac - | ffmpeg -i pipe:0 -f mp3 pipe:1 | gcloud storage cp - gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.mp3
```

## Streaming uploads
Stream upload for GCS also works. Instead of saving the encoded file locally, let's upload it to the second bucket
```
gcloud storage cp gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac - | ffmpeg -i pipe:0 -f mp3 pipe:1 | gcloud storage cp - gs://$PROJECT_ID-end/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.mp3
```

## Package it to a container and run it
We're going to need some APIs activated first. Activate artifact registry

```bash
gcloud services enable artifactregistry.googleapis.com
```

Let's create an repository for our Docker images
```bash
gcloud artifacts repositories create repository \
    --repository-format=docker \
    --location=europe-west1
```

Now let's build our docker Image. We'll let Cloud Build do it for us.

First, activate the Cloud Build API
```bash
gcloud services enable cloudbuild.googleapis.com
```

And run the following command to build our encoder
```
gcloud builds submit -t europe-west1-docker.pkg.dev/believe-poc/repo/encoder
```

Let's see if our encoder works as expected
```
docker run europe-west1-docker.pkg.dev/believe-poc/repo/encoder gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac gs://$PROJECT_ID-end/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.mp3
```
