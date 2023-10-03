# Lab 5

## Task 1

Let's create a firestore database where we'll save the additional data for the uploaded files.

Just run the following command to create one;

```bash
gcloud alpha firestore databases create \
  --database="(default)" \
  --location=eur3 \
  --type=firestore-native
```

## Task 2

Create a bucket for the uploads named `${PROJECT_ID}-uploads`. We want to separate uploads from the pipeline.
Only when the data is saved in Firestore we'll move the uploaded file to the pipeline.

[Documentation](https://cloud.google.com/storage/docs/creating-buckets#storage-create-bucket-console)

You'll need to set up CORS on it to allow upload from a browser. Apply the `cors.json` file to the bucket.

[Documentation](https://cloud.google.com/storage/docs/using-cors#console)

## Task 3

- Create a service account named `backstage` for the backstage application.

  [Documentation](https://cloud.google.com/iam/docs/service-accounts-create#creating)

- Grant the roles `Storage Object User` to the new bucket and to the bucket start .

  [Documentation](https://cloud.google.com/storage/docs/access-control/using-iam-permissions)

- Grant the roles `Cloud Datastore User` and `Service Account Token Creator` at the project level.

  [Documentation](https://cloud.google.com/iam/docs/granting-changing-revoking-access)

## Task 4

- Enable the IAM Credentials API [here](https://console.cloud.google.com/apis/library/iamcredentials.googleapis.com)

- Navigate to the backstage directory and build the image container:

  ```bash
  gcloud builds submit -t europe-west1-docker.pkg.dev/${PROJECT_ID}/repository/backstage
  ```

- Deploy a Cloud Run service with the new container image

  - Name the service `backstage`
  - Select the last image you built
  - Select the region europe-west1
  - Allow unauthenticated invocations
  - Container port is 3000
  - environment variable FIRESTORE_PROJECT_ID must be `${PROJECT_ID}`
  - environment variable UPLOAD_BUCKET must be `${PROJECT_ID}-uploads`
  - environment variable START_BUCKET must be `${PROJECT_ID}-start`
  - Select backstage as a service account

  [Documentation](https://cloud.google.com/run/docs/deploying#service)
