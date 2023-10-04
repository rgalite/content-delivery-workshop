import { updateFile } from "@/lib/db"
import { NextResponse } from "next/server"

export const PUT = async (request, { params }) => {
  try {
    const fileId = params.id
    const {
      file: { status, workflowId, destFilename, srcFilename },
    } = await request.json()

    const file = await updateFile(fileId, {
      status,
      workflowId,
      destFilename,
      srcFilename,
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
