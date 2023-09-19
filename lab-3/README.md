# Lab 3

In this lab, we'll have Cloud Run running the encoding process for us.
We'll configure a Cloud Run job referencing the container image we just pushed to artifact registry.

## Bootstrap

```
export PROJECT_ID=$(gcloud config get project)
```

## Creating a Service Account for the job

Our Cloud Run Job will need to read and write from the GCS buckets we created earlier. We'll need to assign permissions to the job.

Let's [create](https://cloud.google.com/iam/docs/service-accounts-create#creating) a service account first.

<details>
  <summary>Here is the CLI command.</summary>

  ```bash
  gcloud iam service-accounts create encoder \
      --display-name="Music Encoder"
  ```
</details>

Allow this new service account to read from our bucket `PROJECT_ID-start`. You'll need to assign the [Storage Object Viewer](https://cloud.google.com/storage/docs/access-control/iam-roles#standard-roles) role.

Here is the [documentation](https://cloud.google.com/storage/docs/access-control/using-iam-permissions#bucket-iam) to do it.

<details>
  <summary>Fastlane</summary>

  ```bash
  gcloud storage buckets add-iam-policy-binding gs://${PROJECT_ID}-start --member=serviceAccount:encoder@${PROJECT_ID}.iam.gserviceaccount.com --role=roles/storage.objectViewer
  ```
</details>

Allow this new service account to write to our bucket `$PROJECT_ID-end`. You'll need to assign the [Storage Object User](https://cloud.google.com/storage/docs/access-control/iam-roles#standard-roles) role.

Here is the [documentation](https://cloud.google.com/storage/docs/access-control/using-iam-permissions#bucket-iam) to do it or run the following command.

```bash
gcloud storage buckets add-iam-policy-binding gs://${PROJECT_ID}-end --member=serviceAccount:encoder@${PROJECT_ID}.iam.gserviceaccount.com --role=roles/storage.objectUser
```

## Create and execute the Cloud Run Job

Use the [documentation](https://cloud.google.com/run/docs/create-jobs) to create a Cloud Run Job.

Select the latest docker image `encoder` and make sure to select the `encoder` service account in the security tab.

Leave the rest of the options as is.

Now, let's execute with overrides (click on the down arrow next to the `EXECUTE` button).
In the container arguments, put this value. Don't forget to replace the `$PROJECT_ID` placeholder.

```
gs://$PROJECT_ID-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac gs://$PROJECT_ID-end/lab-3/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.mp3
```

Head to the `lab-3` folder in the `$PROJECT_ID-end` bucket and play the file.

## Congratulations!
You can now run a container in the cloud with Cloud Run Job.
