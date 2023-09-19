# Introduction
In this lab, we'll create a job to process a file uploaded to a bucket and upload it to a second bucket.

## Bootstrap

Make sure these environment variables are defined before starting.

```
export PROJECT_ID=$(gcloud config get project)
```

Install ffmeg to your local workstation. If you're running this lab in cloud shell or in a debian-based machine, the following commands will install the binary.
Otherwise, please refer to ffmeg [documentation](https://ffmpeg.org/download.html).

```bash
sudo apt update -y
sudo apt install -y ffmpeg
```

## Streaming download

Use the documentation to [download](https://cloud.google.com/storage/docs/streaming-downloads#prereq-cli) the file and stream it to ffmeg [process](https://ffmpeg.org/ffmpeg-protocols.html#pipe).

```bash
gcloud storage cp gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac - | ffmpeg -i pipe:0 -f mp3 ./downloads/output.mp3
```

Make sure the file works by openining it in your IDE or download it to your local workstation.

## Streaming uploads

GCS also supports streaming uploads.

Instead of saving the encoded file locally, let's upload it to the second bucket.

Note that we need to set a content-type to the upload command. Otherwise, gcs will save the file as [application/octet-stream](https://cloud.google.com/storage/docs/metadata#content-type) making the file unplayable.

```bash
gcloud storage cp gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac - | ffmpeg -i pipe:0 -f mp3 pipe:1 | gcloud storage cp - gs://$PROJECT_ID-end/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.mp3 --content-type=audio/mp3
```

Download the resulting file to your local workstation to make sure it works.

```bash
gcloud storage cp gs://$PROJECT_ID-end/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.mp3 ./downloads/output-end.mp3
```

## Package it to a container and run it
We're going to need some APIs activated first. Activate artifact registry.

```bash
gcloud services enable artifactregistry.googleapis.com
```

Let's create an repository for our Docker images.

From the left sidebar in console, select CI/CD > Artifact Registry.
Create a Docker reposistory in the region **europe-west1**.

If you prefer doing this with the CLI, here is the command.

```bash
gcloud artifacts repositories create repository \
    --repository-format=docker \
    --location=europe-west1
```

Now let's build our docker Image. We'll let Cloud Build do it for us.

First, activate the Cloud Build API.

```bash
gcloud services enable cloudbuild.googleapis.com
```

And run the following command to build our encoder.

```bash
gcloud builds submit -t europe-west1-docker.pkg.dev/believe-poc/repo/encoder
```

Let's see if our encoder works as expected.

```bash
docker run -v ~/.config/gcloud:/root/.config/gcloud \
    europe-west1-docker.pkg.dev/believe-poc/repo/encoder \
    gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac \
    gs://$PROJECT_ID-end/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.mp3
```

## Congratulations!
We now have a container image that can encode FLAC files to MP3 from Cloud Storage!
