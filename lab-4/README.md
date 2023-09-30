# Lab 4

In this lab, we'll implement a small Cloud Workflow to orchestrate 2 tasks.
This workflow will be triggered from an Event Arc event.

## Create a worfklow pipeline

Our workflow uses a GCS file in input and performs 2 tasks:

  * Perform an API request to a mock API and verify the file is harmless
  * Encode the FLAC file to an MP3 file

### Task 1

We will be using faking a Virus scanning API. Our Fake API will need an key.<br />
Because it's sensitive data, we will store it safely in a Secret thanks to Secret Manager.

Create a Secret named `virus_scanning_api_key` and put a random API Key inside it.

[Documentation](https://cloud.google.com/secret-manager/docs/create-secret-quickstart).

Make sure the `encoded` service account can access this secret. <br />
Here is the documentation: https://cloud.google.com/secret-manager/docs/manage-access-to-secrets

### Task 2

Create a new file locally named workflow.yaml and paste the following content:

```yaml
main:
  params: [event]
  steps:
  - init:
  - access_string_secret:
  - virus_scanning:
  - virus_scanning_check:
  - run_encoder_job:
```

Create the following steps:
  * **init**

    Set the following variables:
      * `project_id`: `GOOGLE_CLOUD_PROJECT_ID` # [provided](https://cloud.google.com/workflows/docs/reference/stdlib/sys/get_env) by workflows
      * `secret_id`: `virus_scanning_api_key`
      * `file_id`: `${event.data.id}`
      * `bucket`: `${event.data.bucket}`
      * `cloud_run_job_name`: `encoder`
      * `cloud_run_job_location`: `europe-west1`
      * `source_uri`: `gs://${event.data.bucket}/lab-4/${event.data.id}`
      * `destination_uri`: The destination URI has the form `gs://${PROJECT_ID}-end/lab-4/filename`

    [Documentation](https://cloud.google.com/workflows/docs/reference/syntax/variables#assign-step)

  * **access_string_secret**<br />

    Fetches the content for the secret named `virus_scanning_api_key` and save it to a variable named `virus_scanning_api_key_str`.

    [Documentation](https://cloud.google.com/workflows/docs/reference/googleapis/secretmanager/Overview)

  * **virus_scanning**: <br />

    Performs an http call to a mock API to scan `${source_uri}` and store the result in a variable named `virus_scanning_result`.

    * The API `url` is `https://httpbin.org/anything`.
    * Send the `body`:
      * `file_url: ${source_uri}`
      * `is_safe: true`
    * You'll need to send some `headers` too
      * `x-apikey: ${virus_scanning_api_key_str}`
      * `content-type: application/json`

    [Documentation](https://cloud.google.com/workflows/docs/http-requests)

  * **virus_scanning_check**: <br />

    Check if the file we scanned is safe. If it's not, stop the workflow here and [return](https://cloud.google.com/workflows/docs/reference/syntax/completing#using-return) `not_safe`.

    [Documentation](https://cloud.google.com/workflows/docs/reference/syntax/conditions)

  * **run_encoder_job**: <br />

    Execute the Cloud Run Job we created earlier, referenced by the variable `${cloud_run_job_name}`. Make sure you target the right location, referenced by `${cloud_run_job_location}`.

    [Documentation](https://cloud.google.com/workflows/docs/reference/googleapis/run/v1/namespaces.jobs/run)

    Remember that our Cloud Run Job is expecting arguments `${source_uri}` and `${destination_uri}`.

### Task 3

* Create a service account named `sa-workflow-flac-to-mp3` for our new Workflow.

  [Documentation](https://cloud.google.com/iam/docs/service-accounts-create#creating)

* Grant the Role `Logging > Logs Writer` and `Workflows > Workflows Invoker` to the new service account.

  [Documentation](https://cloud.google.com/iam/docs/granting-changing-revoking-access)

* The Workflow will need to have access to the `PROJECT_ID-start` bucket.
Give the role `Storage Object Viewer` to the `sa-workflow-flac-to-mp3` service account.

  [Documentation](https://cloud.google.com/storage/docs/access-control/using-iam-permissions#bucket-iam)

* The workflow will need to have access to our secret. Give the role secret accessor to the secret `virus_scanning_api_key` to the service account `sa-workflow-flac-to-mp3`.

  [Documentation](https://cloud.google.com/secret-manager/docs/manage-access-to-secrets)

* The workflow will need access our Cloud Run Job. Give the role `invoker` and `developer` to the service account on the cloud run job `encoder` `sa-workflow-flac-to-mp3`.

  [Documentation](https://cloud.google.com/run/docs/securing/managing-access#job-add-principals)

### Task 4 - Create the workflow

Create a workflow: named `workflow-flac-to-mp3` in the region `europe-west1` and using the service account `sa-workflow-flac-to-mp3` that you just created. Set the call log level to `All Logs`. <br />

In the workflow editor, paste the content from `workflow.yaml`.

[Documentation](https://cloud.google.com/workflows/docs/create-workflow-console)

Manually execute the workflow with the following input

```json
{
    "data": {
        "bucket": "<bucket>",
        "id": "<path-to-a-file>"
    }
}
```

If everything is ran fine, let's move on to the next task.
Otherwise check the logs in the execution panel or Cloud Logging.

### Task 5 - Use Event Arc

We want to execute the workflow when a new file is pushed to the `start` bucket.
Edit the workflow and Add a new trigger of type Event Arc.

* The trigger name must be `trigger-gcs-workflow-flac-to-mp3`
* The trigger type must be `Google Sources`
* The event provider must be `Cloud Storage`
* The event must be `google.cloud.storage.object.v1.finalized`
* Select the start bucket
* Select the same service account as the workflow: `sa-workflow-flac-to-mp3`
* Grant the missing roles

[Documentation](https://cloud.google.com/workflows/docs/trigger-workflow-eventarc#create_a_trigger_using_the_console)

Drop a new FLAC file in the bucket or make a duplicate of the uploaded file and see the workflow being automatically executed.

```bash
gcloud storage cp gs://${PROJECT_ID}-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams.flac gs://${PROJECT_ID}-start/Get-Lucky-Daft-Punk-feat-Pharrell-Williams-2.flac
```
