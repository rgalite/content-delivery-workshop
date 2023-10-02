import { NextResponse } from "next/server"
import { generateSignedUrl } from "@/lib/storage"

export const POST = async (request) => {
  const json = await request.json()

  const url = await generateSignedUrl({
    contentType: json.content_type,
    filename: json.filename,
  })

  return NextResponse.json({
    upload: {
      url,
      filename: json.filename,
      content_type: json.content_type,
    },
  })
}
