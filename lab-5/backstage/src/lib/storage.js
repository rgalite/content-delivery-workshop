import { Storage } from "@google-cloud/storage"

export async function generateSignedUrl({ contentType, filename }) {
  const options = {
    version: "v4",
    action: "write",
    expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    contentType,
  }

  const storage = new Storage()
  const bucketName = process.env.UPLOAD_BUCKET
  const randomFilename = `${crypto.randomUUID()}-${filename}`

  const [url] = await storage
    .bucket(bucketName)
    .file(randomFilename)
    .getSignedUrl(options)

  return { url, filename: randomFilename }
}

export async function copyFile({ fileId, srcFilename, contentType }) {
  const storage = new Storage()

  // The ID of the bucket the original file is in
  const srcBucketName = process.env.UPLOAD_BUCKET

  // The ID of the GCS file to copy
  // const srcFilename = 'your-file-name';

  // The ID of the bucket to copy the file to
  const destBucketName = process.env.START_BUCKET

  // The ID of the GCS file to create
  const destFileName = srcFilename

  const copyDestination = storage.bucket(destBucketName).file(destFileName)

  // Optional:
  // Set a generation-match precondition to avoid potential race conditions
  // and data corruptions. The request to copy is aborted if the object's
  // generation number does not match your precondition. For a destination
  // object that does not yet exist, set the ifGenerationMatch precondition to 0
  // If the destination object already exists in your bucket, set instead a
  // generation-match precondition using its generation number.
  const copyOptions = {
    metadata: {
      fileId,
    },
    contentType,
  }

  // Copies the file to the other bucket
  await storage
    .bucket(srcBucketName)
    .file(srcFilename)
    .copy(copyDestination, copyOptions)
}
