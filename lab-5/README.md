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

Make sur your new service works.

## Task 5 - Bonus 1

The files status are not updated. Update the workflow to update it.

- Use the data in `event.data.metadata.fileId` to get the GCS file metadata. The `fileId` will be your reference to the database object to update.
- There is a endpoint to update files: `/api/files/{fileId}` which accepts payload in the form of:

  ```json
  {
    "file": {
      "status": "processing"
    }
  }
  ```

- Update the environment variable `SHOW_STATUS` to `true` to show it in the app and redeploy your Cloud Run instance.

## Task 6 - Bonus 2

Your app is working well but it's available to everybody. Let's protect it.

- Create a load balancer in front of your Cloud Run Service. You can use nip.io as a custom domain name.

  [Documentation: Set up a global external Application Load Balancer with Cloud Run](https://cloud.google.com/load-balancing/docs/https/setup-global-ext-https-serverless)

- Enable IAP to protect your application.

  [Documentation; Read Enabling IAP for Cloud Run](https://cloud.google.com/iap/docs/enabling-cloud-run)

## Task 6 - Bonus 2

The files status are not updated. Update the workflow to update it.<br />
Note that the object id saved in base is save in the GCS file metadata.

## Task 7 - Bonus 3

Update the code in `lab-5/backstage/src/app/api/files/route.js` to not call `copyFile` but trigger the function from an EventArc trigger, on new file saved in datastore.
