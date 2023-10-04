import Firestore, { FieldValue } from "@google-cloud/firestore"

const db = new Firestore({
  projectId: process.env.FIRESTORE_PROJECT_ID,
})

db.settings({ ignoreUndefinedProperties: true })

export const getAllFiles = async () => {
  const snapshot = await db.collection("files").get()
  const docs = snapshot.docs.map((doc) => {
    const { name, size, status, type, createdTime } = doc.data()

    return {
      id: doc.id,
      name,
      size,
      type,
      status,
      createdTime: new Date(createdTime._seconds * 1000).toUTCString(),
    }
  })

  return docs
}

export const addFile = async ({ name, size, type, filename }) => {
  const res = await db.collection("files").add({
    name,
    size,
    type,
    filename,
    status: "pending",
    createdTime: FieldValue.serverTimestamp(),
  })

  return res
}

export const updateFile = async (
  fileId,
  { status, workflowExecutionId, srcFilename, destFilename }
) => {
  const file = await db.collection("files").doc(fileId)

  await file.set(
    {
      status,
      workflowExecutionId,
      srcFilename,
      destFilename,
      updatedTime: FieldValue.serverTimestamp(),
    },
    { merge: true, ignoreUndefinedProperties: true }
  )

  return await db.collection("files").doc(fileId).get()
}

export default db
