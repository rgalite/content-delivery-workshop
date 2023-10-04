import { getFile } from "@/lib/db"
import { copyFile } from "@/lib/storage"
import { NextResponse } from "next/server"

export const POST = async (_, { params }) => {
  try {
    const file = await getFile(params.id)
    const fileData = await file.data()

    await copyFile({
      fileId: file.id,
      srcFilename: fileData.filename,
      contentType: fileData.type,
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
