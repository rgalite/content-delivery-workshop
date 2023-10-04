# Solutions

## Task 1

Create a Secret named `virus_scanning_api_key`.

```bash
gcloud secrets create virus_scanning_api_key
```

And put a random API Key inside it.

```bash
echo -n "secret" | gcloud secrets versions add virus_scanning_api_key --data-file=-
```

## Task 2

Create a new file locally named workflow.yaml and paste the following content.

```yaml
main:
  params: [event]
  steps:
    - init:
        assign:
          - project_id: ${sys.get_env("GOOGLE_CLOUD_PROJECT_ID")}
          - secret_id: virus_scanning_api_key
          - cloud_run_job_name: encoder
          - cloud_run_job_location: europe-west1
          - source_uri: ${"gs://" + event.data.bucket + "/" + event.data.name}
          - destination_uri: ${"gs://" + project_id + "-end/lab-4/" + text.replace_all(event.data.name, ".flac", ".mp3")}
    - access_string_secret:
        call: googleapis.secretmanager.v1.projects.secrets.versions.accessString
        args:
          secret_id: ${secret_id}
          project_id: ${project_id}
        result: virus_scanning_api_key_str
    - virus_scanning:
        call: http.post
        args:
          url: https://httpbin.org/anything
          body:
            file_url: ${source_uri}
            is_safe: true
          headers:
            x-apikey: ${virus_scanning_api_key_str}
            accept: application/json
            content-type: application/json
        result: virus_scanning_result
    - virus_scanning_check:
        switch:
          - condition: ${not(virus_scanning_result.body.json.is_safe)}
            return: "not_safe"
    - run_encoder_job:
        call: googleapis.run.v1.namespaces.jobs.run
        args:
          name: ${"namespaces/" + project_id + "/jobs/" + cloud_run_job_name}
          location: ${cloud_run_job_location}
          body:
            overrides:
              containerOverrides:
                args:
                  - ${source_uri}
                  - ${destination_uri}
```

### Task 3

- Create a service account named `sa-workflow-flac-to-mp3` for our new Workflow.

  ```bash
  gcloud iam service-accounts create sa-workflow-flac-to-mp3 \
      --description="Service Account used by the Workflow workflow-flac-to-mp3"
  ```

- Grant the Role `Logging > Logs Writer` to the new service account.

  ```bash
  gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member=serviceAccount:sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com \
    --role=roles/logging.logWriter
  ```

- The Workflow will need to have access to the `PROJECT_ID-start` bucket.
  Give the role `Storage Object Viewer` to the `sa-workflow-flac-to-mp3` service account.

  ```bash
  gcloud storage buckets add-iam-policy-binding gs://${PROJECT_ID}-start \
    --member=serviceAccount:sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com \
    --role=roles/storage.objectViewer
  ```

- The workflow will need to have access to our secret. Give the role secret accessor to the secret `virus_scanning_api_key` to the service account `sa-workflow-flac-to-mp3`.

  ```bash
  gcloud secrets add-iam-policy-binding virus_scanning_api_key \
      --member="serviceAccount:sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com" \
      --role="roles/secretmanager.secretAccessor"
  ```

- The workflow will need access our Cloud Run Job. Give the role `invoker` and `developer` to the cloud run job `encoder` to the service account `sa-workflow-flac-to-mp3`.

```bash
gcloud run jobs add-iam-policy-binding encoder --region europe-west1 \
    --member=serviceAccount:sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com \
    --role=roles/run.developer
```

```bash
gcloud run jobs add-iam-policy-binding encoder --region europe-west1 \
    --member=serviceAccount:sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com \
    --role=roles/run.invoker
```

## Task 4

```bash
gcloud workflows deploy workflow-flac-to-mp3 --source=workflow.yaml \
  --service-account=sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com \
  --location=europe-west1
```

## Task 5

Add a new trigger of type Event Arc.

```bash
gcloud services enable eventarc.googleapis.com \
  eventarcpublishing.googleapis.com \
  workflows.googleapis.com \
  workflowexecutions.googleapis.com
```

```bash
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:$(gsutil kms serviceaccount -p ${PROJECT_ID})" \
  --role="roles/pubsub.publisher"
```

```bash
gcloud projects add-iam-policy-binding ${PROJECT_ID} \
    --member="serviceAccount:sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com" \
    --role="roles/eventarc.eventReceiver"
```

```bash
  gcloud eventarc triggers create trigger-gcs-workflow-flac-to-mp3 \
    --location=eu \
    --destination-workflow=workflow-flac-to-mp3  \
    --destination-workflow-location=europe-west1 \
    --event-filters="type=google.cloud.storage.object.v1.finalized" \
    --event-filters="bucket=${PROJECT_ID}-start" \
    --service-account="sa-workflow-flac-to-mp3@${PROJECT_ID}.iam.gserviceaccount.com"
```
