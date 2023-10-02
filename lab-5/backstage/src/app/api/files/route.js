import { addFile, getAllFiles } from "@/lib/db"
import { copyFile } from "@/lib/storage"
import { NextResponse } from "next/server"

export const POST = async (request) => {
  try {
    const json = await request.json()
    const {
      file: { name, size, type, filename },
    } = json

    const file = await addFile({ name, size, type, filename })
    await copyFile({
      fileId: file.id,
      srcFilename: filename,
      contentType: type,
    })

    return NextResponse.json({
      file: {
        id: file.id,
      },
    })
  } catch (error) {
    console.error("Error when adding new file.", error)
    return NextResponse.json({
      error: error.message,
    })
  }
}

export const GET = async () => {
  return NextResponse.json({
    files: await getAllFiles(),
  })
}
