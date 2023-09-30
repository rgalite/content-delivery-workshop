# Lab 1 Introduction to Cloud Storage

The aim of this lab is building our the first step of our application. We'll let users upload files to GCS and store the file in a bucket.

## Introduction

* Set up the environment variable `PROJECT_ID`

  ```bash
  export PROJECT_ID=$(gcloud config get project)
  ```

* Make sure you are in the `lab-1` directory to start this lab.

  ```bash
  cd lab-1
  ```

* Download a FLAC file and store in in the `media` directory. To make things simple, make sure the file doesn't contain any space.

## Creating buckets

Start by creating a GCS bucket. From the Console, select Cloud Storage and create a new bucket.

The buckets name are unique across GCP. To prevent collision, you'll prefix it with your project id, only known by yourself.

Name it `${PROJECT_ID}-start`. The class must be `Standard` and the bucket must be located in `Europe`.

[Documentation](https://cloud.google.com/storage/docs/creating-buckets)

## Uploading and downloading files from CLI

Use the gcloud CLI to upload a file to the bucket you just created

```bash
gcloud storage cp ./media/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac
```

This is the output you should get

```
Copying file://./media/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac to gs://believe-poc-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac
  Completed files 1/1 | 127.4MiB/127.4MiB

Average throughput: 106.4MiB/s
```

Now let's try downloading the file to our local workstation.

```bash
gcloud storage cp gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac ./downloaded.flac
```

You should see something like this.

```
Copying gs://believe-poc-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac to file://./downloaded.flac
  Completed files 1/1 | 127.4MiB/127.4MiB

Average throughput: 611.2MiB/s
```
