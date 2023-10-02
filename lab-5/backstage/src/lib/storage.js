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

  const [url] = await storage
    .bucket(bucketName)
    .file(filename)
    .getSignedUrl(options)

  return url
}
