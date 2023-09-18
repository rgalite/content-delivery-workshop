# Lab 1

## Bootstrap

Set up the environment variable `PROJECT_ID`
```
export PROJECT_ID=$(gcloud config get project)
```

## Creating buckets

The aim of this lab is building our the first step of our application. We'll let users upload files to GCS and store the file in a bucket.

Start by creating a GCS bucket. Their name are unique across GCP. To prevent collision, prefix it with your project id, only known by yourself.

```
gcloud storage buckets create gs://$PROJECT_ID-start -l eu -c Standard
```

With `-c`, we're telling the API we want to use a Standard Class, and with `-l`, the bucket's content should be stored in Europe.

Create a second bucket

```
gcloud storage buckets create gs://$PROJECT_ID-end -l eu -c Standard
```

## Uploading and downloading files

Use the gcloud CLI to upload a file to the bucket you just created:

```bash
gcloud storage cp ./media/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac
```

```
Copying file://./media/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac to gs://believe-poc-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac
  Completed files 1/1 | 127.4MiB/127.4MiB

Average throughput: 106.4MiB/s
```

Now let's try downloading the file to our local workstation:
```bash
gcloud storage cp gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac ./downloaded.flac
```

You should see something like this:
```
Copying gs://believe-poc-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac to file://./downloaded.flac
  Completed files 1/1 | 127.4MiB/127.4MiB

Average throughput: 611.2MiB/s
```

List the files locally
```bash
ls -l
```

You should see the file you just downloaded
```
...
-rw-r--r-- 1 user user 133539564 Sep  6 15:22 downloaded.flac
...
```
