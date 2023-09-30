# Solutions for Lab 3

## Task 1

```bash
  gcloud iam service-accounts create encoder --display-name="Music Encoder"
```

## Task 2
```bash
  gcloud storage buckets add-iam-policy-binding gs://${PROJECT_ID}-start \
    --member=serviceAccount:encoder@${PROJECT_ID}.iam.gserviceaccount.com \
    --role=roles/storage.objectViewer
```

## Task 3

```bash
gcloud storage buckets add-iam-policy-binding gs://${PROJECT_ID}-end \
  --member=serviceAccount:encoder@${PROJECT_ID}.iam.gserviceaccount.com \
  --role=roles/storage.objectUser
```


## Task 4
```bash
gcloud run jobs replace...
```
